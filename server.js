var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , qs = require('querystring')
  , port = 8080

// Add more movies! (For a technical challenge, use a file, or even an API!)
var movies = ['Jaws', 'Jaws 2', 'Jaws 3', 'Doctor Strange', 'Space Jam', 'Big Fish', 'The Illusionist', 'Inception', 'Star Wars Episode IV', 'Star Wars Episode V', 'Star Wars Episode VI']

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    // Note the new case handling search
    case '/search':
      handleSearch(res, uri)
      break
    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    case '/':
      sendIndex(res)
      break
    case '/index.html':
      sendIndex(res)
      break
    case '/css/style.css':
      sendFile(res, 'style.css', 'text/css')
      break
    case '/js/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript')
      break
    default:
      res.end('404 not found')
  }

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

// subroutines

// You'll be modifying this function
function handleSearch(res, uri) {
  var contentType = 'text/html'
  res.writeHead(200, {'Content-type': contentType})

  if(uri.query) {
    // PROCESS THIS QUERY TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    console.log( uri.query )
    data = qs.parse( uri.query )
    results = []
    for (var movie of movies) {
      if (movie.toLowerCase().indexOf(data.search.toLowerCase()) !== -1) {
        results.push(movie);
      };
    }
    res.end( createHTML(results) )
  } else {
    res.end('No query provided')
  }
}

// Note: consider this your "index.html" for this assignment
function sendIndex(res) {
  var contentType = 'text/html'
    , html = createHTML(movies)
  
  res.writeHead(200, {'Content-type': contentType})
  res.end(html, 'utf-8')
}

function createHTML(movies) {
  html = ' ' 
  html = html + '<html>'

  html = html + '<head>'
  html = html + '<link rel="stylesheet" type="text/css" href="css/style.css"/>'
  html = html + '<link href="https://fonts.googleapis.com/css?family=Itim" rel="stylesheet">'
  html = html + '<script src="https://use.fontawesome.com/53f66de2be.js"></script>'
  html = html + '</head>'

  html = html + '<body>'
  html = html + '<h1>Movie Search!</h1>'

  html = html + '<form action="search" method="search">'
  html = html + '<input type="text" id="search" name="search" />'
  html = html + '<button id="search_btn" type="submit"><i class="fa fa-search fa-lg fw"></i></button>'
  html = html + '</form>'

  html = html + '<ul>'
  // Note: the next line is fairly complex. 
  // You don't need to understand it to complete the assignment,
  // but the `map` function and `join` functions are VERY useful for working
  // with arrays, so I encourage you to tinker with the line below
  // and read up on the functions it uses.
  //
  // For a challenge, try rewriting this function to take the filtered movies list as a parameter, to avoid changing to a page that lists only movies.
  if (movies.length === 0) {
      html = html + '<h2>No Results</h2>'
  }
  else {
    html = html + movies.map(function(d) { return '<li>'+d+'</li>' }).join(' ')
  }
  html = html + '</ul>'

  html = html + '</body>'
  html = html + '</html>'
  return html
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}
