app.get('/main', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'main.html')))
 			})
  app.get('/apply', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'apply.html')))
 			})
  app.get('/admin', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'admin.html')))
 			})
  app.get('/view', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'view.html')))
 			})