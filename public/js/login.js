gapi.load('auth2', function() {
  auth2 = gapi.auth2.init({
    client_id: '490379597944-pigcng7tfb8hb199p0ppcoiiuh1mio6h.apps.googleusercontent.com',
    fetch_basic_profile: true,
    scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/admin.directory.userschema.readonly profile email openid'
  });

  // Sign the user in, and then retrieve their ID.
  auth2.signIn().then(function(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse();
		
 	$.ajax({
 		method: 'GET',
 		url : "https://www.googleapis.com/admin/directory/v1/users/" + profile.getEmail() + "?projection=full&viewType=domain_public",
 		params: {
 			projection: 'full',
 			viewType: 'domain_public',
 			domain: "cronj.com"
 		},
 		headers: {
 			Authorization: "Bearer " + googleUser.getAuthResponse().access_token
 		}

 	}).done(function(data){
 		sessionStorage.setItem('pp', profile.getImageUrl());
		sessionStorage.setItem('id_token', JSON.stringify(id_token));
		sessionStorage.setItem('email', profile.getEmail());
		sessionStorage.setItem('namee', profile.getName());
		sessionStorage.setItem('doj', data.customSchemas.Dates.Date_of_Joining);
 		$.post("/login", {id_token : id_token.id_token, email : profile.getEmail(), test: id_token, pp : profile.getImageUrl()},function(result){
         		window.location=result.redirect;
         	});
 	})
  });
});