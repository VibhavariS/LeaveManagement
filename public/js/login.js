gapi.load('auth2', function() {
  auth2 = gapi.auth2.init({
    client_id: '80946248974-usm5tioi12k6pf6t48epj8cri5bp9jo7.apps.googleusercontent.com',
    fetch_basic_profile: true,
    scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/admin.directory.userschema.readonly profile email openid'
  });

  // Sign the user in, and then retrieve their ID.
  auth2.signIn().then(function(googleUser) {
    console.log(googleUser);
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse();
	console.log(id_token);
		
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
 		console.log(data);
 		sessionStorage.setItem('pp', profile.getImageUrl());
		sessionStorage.setItem('id_token', JSON.stringify(id_token));
		sessionStorage.setItem('email', profile.getEmail());
		sessionStorage.setItem('namee', profile.getName());
		sessionStorage.setItem('doj', data.customSchemas.Dates.Date_of_Joining);
 		$.post("http://localhost:8080/login", {id_token : id_token.id_token, email : profile.getEmail(), test: id_token, pp : profile.getImageUrl()},function(result){
         		window.location=result.redirect;
         	});
 	})
  });
});