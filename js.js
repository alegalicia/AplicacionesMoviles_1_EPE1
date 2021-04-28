const http = require("http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");
const mime = {
  html: "text/html",
  css: "text/css",
  jpg: "image/jpg",
  png: "image/png",
  ico: "image/x-icon",
  mp3: "audio/mp3",
  mp4: "video/mp4",
};

const servidor = http.createServer((pedido, respuesta) => {
  const objetourl = url.parse(pedido.url);
  let camino = "web" + objetourl.pathname;
  if (camino == "web/") camino = "web/index.html";
  encaminar(pedido, respuesta, camino);
});
servidor.listen(8888);

function encaminar(pedido, respuesta, camino) {
  console.log(camino);

  switch (camino) {
    case "web/recuperardatos": {
      recuperar(pedido, respuesta);
      break;
    }
    default: {
      fs.stat(camino, (error) => {
        if (!error) {
          fs.readFile(camino, (error, contenido) => {
            if (error) {
              respuesta.writeHead(500, { "Content-Type": "text/html" });

              respuesta.write("error interno, no reconoce ruta");

              respuesta.end();
            } else {
              const vec = camino.split(".");
              const extension = vec[vec.length - 1];
              const mimearchivo = mime[extension];
              respuesta.writeHead(200, { "Content-Type": mimearchivo });
              respuesta.write(contenido);
              respuesta.end();
            }
          });
        } else {
          respuesta.writeHead(404, { "Content-Type": "text/html" });
          respuesta.write(
            "<!doctype html><html><head></head><body><h1>Recurso Inexistente</h1></body></html>"
          );
          respuesta.end();
        }
      });
    }
  }
}

function recuperar(pedido, respuesta) {
  let info = "";
  pedido.on("data", (datosparciales) => {
    info += datosparciales;
  });

  pedido.on("end", () => {
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, { "Content-Type": "text/html" });

    const pagina= `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Concha / Tamayo / Reyes / Cabrera / Galicia</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="css/miCss.css">
  </head>
      <body>
        <h1 class="display-4 text-center bg-primary p-3 text-white">
          Desarrollo de Aplicaciones Moviles 1 - EPE1
        </h1>
    
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="index.html">Menú</a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="fotos.html"
                    >Fotos</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="videos.html"
                    >Videos</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="login.html"
                    >Iniciar Sesión</a
                  >
                </li>
                <li class="nav-item"></li>
              </ul>
            </div>
          </div>
        </nav>
        <h1 class="h1 text-center mt-5">Datos Ingresados</h1>
        <div class="m-4 col-4 container row justify-content-md-center">
            <div class="alert alert-primary" role="alert">
               Usuario: ${formulario["nombre"]}
            </div>
            <div class="alert alert-primary" role="alert">
                Clave: ${formulario["clave"]}
            </div>
         </div>
    <hr><footer style="text-align: center; color: blue;"><strong> Concha / Tamayo / Reyes / Cabrera / Galicia </strong></footer>
  </body>
  </body>
    </html>
        `;
    respuesta.end(pagina);
  });
}

console.log("servidor web iniciado");
