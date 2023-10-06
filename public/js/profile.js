$(document).ready(() => {
  let cropper = undefined;
  
  if (selectedTab === "replies") {
    loadReplies()
  } else {
    loadPosts();
  }

  $('#filePhoto').change((event) => {
    console.log($(event.target))
    const imageType = $(event.target).data("image-type");
    
    console.log(imageType)
    console.log(event.target.files)
    const fileName = event.target.files[0].name;

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (result) => {
      $('#imagePreview').attr('src', result.target.result);
      
      const aspectRatio = imageType === 'coverPhoto' ? 3 / 1 : 1 / 1;
      
      cropper = new Cropper(document.getElementById('imagePreview'), {
        aspectRatio: aspectRatio,
        background: false
      });
    }
  });

  $('#imageUpload').click((event) => {
    const imageType = $(event.target).data("image-type");
    const canvas = cropper.getCroppedCanvas();

    canvas.toBlob((blob) => {
      let formData = new FormData();
      formData.append('croppedImage', blob);

      const route = imageType === 'coverPhoto' ? '/api/users/coverPicture' : '/api/users/profilePicture';

      console.log(route)

      $.ajax({
        url: route,
        type: 'POST',
        data: formData,
        processData: false, // prevent jQuery from converting the data to a string
        contentType: false, // prevent jQuery from setting contentType
        success: () => window.location.reload()
        
      })
    });
  });

  $('#imageUploadModal').on('shown.bs.modal', (event) => {
    console.log('modal opened');
    const imageType = $(event.relatedTarget).data("image-type");
    console.log(imageType)
    $('#imageUpload').data("image-type", imageType);
    $('#filePhoto').data("image-type", imageType);
  });
  
  $('#imageUploadModal').on('hidden.bs.modal', (event) => {
    console.log('modal closed');
    if (cropper)
      cropper.destroy();

    $('#filePhoto').val('');
    $('#imagePreview').attr('src', '');
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