import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import https = require('https');
const Url = require('url-parse');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  //CORS, permit all
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get( "/filteredimage", async ( req, res ) => {
    const imageUrl: string = req.query.image_url;
    if ( !imageUrl || imageUrl.length === 0 ) {
      const errorMessage  = 'Unable to continue because the request parameter image_url is empty or does not exist'; 
      return res.status(422).send( {
        "status" : 422,
        "error" : errorMessage 
      });    
    }

    const url = new Url(imageUrl);

    var options = {method: 'HEAD', host: url.hostname, port: url.port, path: url.pathname},
    //ensure the url specified in request parameter 'image_url' is a valid url e.g. reacheable url
    request = https.request(options, async function(r) {
      //e.g. host return non-200 respond e.g. path or file name not correct for that host
      if ( r.statusCode !== 200) {
        const errorMessage  = 'Unable to process the file specified in the request parameter image_url because host ' + url.host + ' returns HTTP error code: ' + r.statusCode;
        return res.status(422).send( {
          "status" : 422,
          "error" : errorMessage 
        });
      } else {
        try {
          let processedFileFullPath = await filterImageFromURL( imageUrl);
          res.sendFile(processedFileFullPath, function (err) {
            if (err) {
                return res.status(500).send( {
                  "status" : 500,
                  "error" : err
                }); 
            } else {
              try {
                console.log('After sent file, deleting file: ' + processedFileFullPath);
                deleteLocalFiles( [processedFileFullPath] );
              } catch(e) {
                console.log("error removing ", processedFileFullPath); 
              }
            }
          });
        } catch (err) {
          console.log(err);
          return res.status(500).send( {
            "status" : 500,
            "error" : 'Cannot process image due to internal server error.' 
          });         
        }
      }
    });
    request.on('error', err => {
      //e.g. invalid hostname (hostname is invalid)
      const errorMessage  = 'Unable to process the file specified in the request parameter image_url because host ' + url.host + ' is unreacheable.';
      return res.status(422).send( {
        "status" : 422,
        "error" : errorMessage 
      });
    });
    request.end();

  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();