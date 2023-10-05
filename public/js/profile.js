$(document).ready(() => {
  let cropper = undefined;
  
  if (selectedTab === "replies") {
    loadReplies()
  } else {
    loadPosts();
  }

  $('#filePhoto').change((event) => {
    const fileName = event.target.files[0].name;
    // read the file
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (result) => {
      $('#imagePreview').attr('src', result.target.result);
      
      cropper = new Cropper(document.getElementById('imagePreview'), {
        aspectRatio: 1 / 1,
        background: false
      });
    }
  });

  $('#imageUpload').click(() => {
    const canvas = cropper.getCroppedCanvas();
    // console.log(canvas);
    canvas.toBlob((blob) => {
      let formData = new FormData();
      formData.append('croppedImage', blob);

      $.ajax({
        url: '/api/users/profilePicture',
        type: 'POST',
        data: formData,
        processData: false, // prevent jQuery from converting the data to a string
        contentType: false, // prevent jQuery from setting contentType
        success: () => window.location.reload()
      })
    });
  });

})

function loadPosts() {
  $.get("/api/posts", { postedBy: profileUserId, tweetType: 'tweet' }, results => {
    showPosts(results, $(".postsContainer"))
  })
}
function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, tweetType: 'reply' }, results => {
    showPosts(results, $(".postsContainer"))
  })
  
}