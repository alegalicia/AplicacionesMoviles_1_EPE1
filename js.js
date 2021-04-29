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
        case "web/recuperardatos":
            {
                recuperar(pedido, respuesta);
                break;
            }
            //esto es para el txt//
        case 'web/cargar':
            {
                guardardatos(pedido, respuesta);
                break;
            }
            //-----------------------//
        default:
            {
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

        const pagina = `
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
    <footer style="text-align: center; color: blue;"><strong> Concha / Tamayo / Reyes / Cabrera / Galicia </strong></footer>
  </body>
  </body>
    </html>
        `;
        respuesta.end(pagina);
    });
}

// --------------------------------------------//
//funcion para guardar daos//
// --------------------------------------------//
function guardardatos(pedido, respuesta) {
    let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;
    });

    pedido.on('end', () => {
        const formulario = querystring.parse(info);
        respuesta.writeHead(200, { 'Content-Type': 'text/html' });
        const pagina =

            `<!DOCTYPE html>
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
     <h1 class="display-4 text-center bg-primary p-3 text-white">
        Desarrollo de Aplicaciones Moviles 1 - EPE1
    </h1>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html">Menú</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="Pagina1.html">Pagina 1</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="Pagina2.html">Pagina 2</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="Pagina3.html">Pagina 3</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="Pagina4.html">Pagina 4</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="Pagina5.html">Pagina 5</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="Pagina6.html">Pagina 6</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="login.html">Iniciar Sesión</a>
                    </li>
                    <li class="nav-item"></li>
                </ul>
            </div>
        </div>
    </nav>
    <h1 class="h1 text-center mt-3">ingreso de datos</h1>
    <center>
  <strong><b>Nombre de usuario: </strong></b>${formulario['nombre']}<br>
   <strong><b> E-mail: </strong></b>${formulario['E-mail']}<br>
   <strong><b> numero: </strong></b>${formulario['numero']}<hr>
    <a href="pagina5.html">Retornar</a>
  </centeer>
<footer style="text-align: center; color: blue;"><strong> Concha / Tamayo / Reyes / Cabrera / Galicia </strong></footer>
  </body>
  </body>
</html>`

        respuesta.end(pagina);
        grabarEnArchivo(formulario);
    });
}

function grabarEnArchivo(formulario) {
    const datos =
        `Nombre de usuario:${formulario['nombre']}
   E-maill:${formulario['E-mail']}
   numero:${formulario['numero']}`;
    fs.appendFile('web/texto.txt', datos, error => {
        if (error)
            console.log(error);
    });
}
// --------------------------------------------//
//fin de funcion para guardar datos//
// --------------------------------------------//

console.log("servidor web iniciado");