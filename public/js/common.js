const submitButton = document.getElementById('submitPostButton');
const textArea = document.getElementById('postTextArea');
const likeButton = document.querySelector('.likeButton');

textArea.addEventListener('input', () => {
  if (textArea.value.trim().length > 0) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});

submitButton.addEventListener('click', () => {
  const content = textArea.value;
  const data = {
    content: content,
  };

  fetch('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const postHtml = createPostHtml(data);
      const postsContainer = document.querySelector('.postsContainer');
      postsContainer.insertAdjacentHTML('afterbegin', postHtml);
      textArea.value = '';
      submitButton.disabled = true;
    })
    .catch((err) => console.log(err));
});

// likeButton.addEventListener('click', () => {
//   alert('You clicked the like button');
// });

$(document).on('click', '.likeButton', (event) => {
  const element = $(event.target);
  const postId = getPostIdFromElemet(element);

  if (postId === undefined) return;

  const isLiked = userLoggedIn?.likedPosts?.some((post) => post.id === postId);

  fetch(`/posts/${postId}/${isLiked ? 'unlike' : 'like'}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((postData) => {
      console.log('BEFORE', userLoggedIn.likedPosts.length);
      if (isLiked)
        userLoggedIn.likedPosts = userLoggedIn.likedPosts.filter(
          (post) => post.id !== postId,
        );
      else userLoggedIn.likedPosts.push(postData);

      console.log('AFTER', userLoggedIn.likedPosts.length);
      element.toggleClass('active');
      element.find('.likes').text(postData.likedBy.length || '');
    })
    .catch((err) => console.log(err));
});

$(document).on('click', '.retweetButton', (event) => {
  const element = $(event.target);
  const postId = getPostIdFromElemet(element);

  if (postId === undefined) return;

  fetch(`/posts/${postId}/retweet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((postData) => {
      console.log('AFTER RETWEET/UNRETWEET', postData);
      console.log(userLoggedIn.retweetedPosts);
      element.toggleClass('active');
      element.find('span').text(postData.retweetedBy.length || '');
    })
    .catch((err) => console.log(err));
});

function getPostIdFromElemet(element) {
  const isRoot = element.hasClass('post');
  let postId = undefined;
  if (!isRoot) {
    postId = element.closest('.post').data().id;
  } else {
    postId = element.data().id;
  }

  return postId;
}

function createPostHtml(postData) {
  if (postData == null) return alert('post object is null');

  let isRetweet = postData.parentTweetId !== null;
  let retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.originalTweet : postData;

  let fullName = postData.postedBy.firstName + ' ' + postData.postedBy.lastName;
  let postDate = timeDifference(new Date(), new Date(postData.createdAt));

  let retweetBlockText = '';
  if (isRetweet)
    retweetBlockText = `<span>
                          <i class="fas fa-retweet"></i> 
                          Retweeted By  <a href="/profile/${retweetedBy}"> @${retweetedBy}</a> 
                        </span>`;

  return `
    <div class="post" data-id="${postData.id}">
      <div class="retweetBlock">
        ${retweetBlockText}
      </div>
      <div class="mainContentContainer">
        <div class="userImageContainer">
          <img src="${postData.postedBy.profilePicture}">
        </div>
        <div class="postContentContainer">
          <div class="header">
            <a href="/profile/${
              postData.postedBy.id
            }" class="displayName">${fullName}</a>
            <span class="username">@${postData.postedBy.username}</span>
            <span class="date">${postDate}</span>
          </div>
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button><i class="far fa-comment"></i></button>
            </div>
            <div class="postButtonContainer green">
              <button class="retweetButton ${
                postData.retweetedBy.some((user) => user.id == userLoggedIn.id)
                  ? 'active'
                  : ''
              }">
                <i class="fas fa-retweet"></i>
                <span class="retweets">${
                  postData.retweetedBy.length || ''
                }</span>
              </button>
            </div>
            <div class="postButtonContainer red">
              <button class="likeButton ${
                postData.likedBy.some((user) => user.id == userLoggedIn.id)
                  ? 'active'
                  : ''
              }" >
                <i class="far fa-heart"></i> 
                <span class="likes">${postData.likedBy.length || ''}</span>
              </button>
          </div>
    </div>
  `;
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return 'Just now';

    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}

// $('#postTextArea').keyup(function (event) {
//   var textArea = event.target;
//   var value = textArea.value.trim();
//   console.log(value );
// });
