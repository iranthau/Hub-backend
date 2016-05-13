Parse.Cloud.beforeDelete(Parse.User, function(request, response) {
  var userQuery = new Parse.Query("SharedPermission");
  userQuery.equalTo("user", request.object);

  var userFriendQuery = new Parse.Query("SharedPermission");
  userFriendQuery.equalTo("userFriend", request.object);

  var mainQuery = Parse.Query.or(userQuery, userFriendQuery);
  var contacts = request.object.get("contacts")

  mainQuery.find({
    success: function(results) {
      Parse.Object.destroyAll(results, {
        success: function() {
          Parse.Object.destroyAll(contacts, {
            success: function() {
              response.success();
            },
            error: function(error) {
              console.error("Error deleting contacts " + error.code + ": " + error.message);
            }
          });
        },
        error: function(error) {
          console.error("Error deleting related shared permissions " + error.code + ": " + error.message);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related shared permissions " + error.code + ": " + error.message);
    }
  });
});
