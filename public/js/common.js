const submitButton = document.getElementById('submitPostButton');
const submitReplyButton = document.getElementById('submitReplyButton');
const textArea = document.getElementById('postTextArea');
const replytextArea = document.getElementById('replyTextArea');
const likeButton = document.querySelector('.likeButton');

// $('#postTextArea').keyup(function (event) {
textArea.addEventListener('input', () => {
  // let textAreaValue = $('#postTextArea').val();
  let textAreaValue = textArea.value.trim();
  if (textAreaValue.length > 0) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});

replytextArea.addEventListener('input', () => {
  if (replytextArea.value.trim().length > 0) {
    submitReplyButton.disabled = false;
  } else {
    submitReplyButton.disabled = true;
  }
});


// $('#submitPostButton').click(() => {
submitButton.addEventListener('click', () => {
  // const content = $('#postTextArea').val();
  const content = textArea.value.trim();
  const data = {
    content: content,
  };

  fetch('/api/posts', {
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
      $('#postTextArea').val() = '';
      $('#submitPostButton').disabled = true;
    })
    .catch((err) => console.log(err));
});

submitReplyButton.addEventListener('click', () => {
  const postId = $('#submitReplyButton').data().id;
  let payload = {
    content: $('#replyTextArea').val(),
    replyToId: postId,
  };

  fetch(`/api/posts/${postId}/reply`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

// $(document).on('show.bs.modal', '#replyModal', (event) => {
$('#replyModal').on('show.bs.modal', (event) => {
  let button = $(event.relatedTarget);
  let postId = getPostIdFromElemet(button);

  // Attach postId to submitReplyButton so it can be used to submit the reply.
  $('#submitReplyButton').data('id', postId);

  $.get('/api/posts/' + postId, (results) => {
    // showPosts([results.postData], $('#originalPostContainer'));
    showPosts([results], $('#originalPostContainer'));
  });
});

$('#replyModal').on('hidden.bs.modal', (event) =>
  $('#originalPostContainer').html(''),
);

$(document).on('click', '.likeButton', (event) => {
  const element = $(event.target);
  const postId = getPostIdFromElemet(element);

  if (postId === undefined) return;

  const isLiked = userLoggedIn?.likedPosts?.some((post) => post.id === postId);

  fetch(`/api/posts/${postId}/${isLiked ? 'unlike' : 'like'}`, {
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

  fetch(`/api/posts/${postId}/retweet`, {
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

$(document).on('click', '.post', (event) => {
  const element = $(event.target);
  const postId = getPostIdFromElemet(element);

  if (postId === undefined) return;

  if (!element.is('button')) window.location.href = '/posts/' + postId;
  // fetch(`/api/posts/${postId}/retweet`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((postData) => {
  //     console.log('AFTER RETWEET/UNRETWEET', postData);
  //     console.log(userLoggedIn.retweetedPosts);
  //     element.toggleClass('active');
  //     element.find('span').text(postData.retweetedBy.length || '');
  //   })
  //   .catch((err) => console.log(err));
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

function createPostHtml(postData, largeFont = false) {
  
  if (postData == null) return alert('post object is null');
  
  let largeClass = largeFont ? 'largeFont' : '';

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

                        
  let replyBlockText = '';
  let isReply = postData.replyToId !== null;
  if (isReply && postData.replyedFrom) { // Also check if replyedFrom is populated [Case When this tweet is a reply to a reply to a reply and so on]
    let postedByUsername = isReply ? postData.replyedFrom.postedBy.username : '';
    replyBlockText = `<div class="replyBlock">
                        Replying to <a href='/profile/${postedByUsername}'>@${postedByUsername}</a>
                      </div>`;
  }

  return `
    <div class="post ${largeClass}" data-id="${postData.id}">
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
          ${replyBlockText}
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button data-toggle='modal' data-target='#replyModal'>
                <i class='far fa-comment'></i>
              </button>
            </div>
            <div class="postButtonContainer green">
              <button class="retweetButton ${
                // postData.retweetedBy.some((user) => user.id == userLoggedIn.id)
                postData.isRetweeted ? 'active' : ''
              }">
                <i class="fas fa-retweet"></i>
                <span class="retweets">${
                  postData._count.retweetedBy || ''
                }</span>
              </button>
            </div>
            <div class="postButtonContainer red">
              <button class="likeButton ${
                // postData.likedBy.some((user) => user.id == userLoggedIn.id)
                postData.isLiked ? 'active' : ''
              }" >
                <i class="far fa-heart"></i> 
                <span class="likes">${postData._count.likedBy || ''}</span>
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

function showPosts(results, document) {
  document.html('');
  console.log('INSIDE SHOW POSTS', results);
  results.forEach((result) => {
    let html = createPostHtml(result);
    document.append(html);
  });

  if (results.length == 0) {
    document.append('<span class="noResults">Nothing to show.</span>');
  }
}

function outputPostsWithReplies(post, container) {
    container.html('');

    if (post.replyedFrom) {
      const html = createPostHtml(post.replyedFrom);
      container.append(html);
    }

    const mainPostHtml = createPostHtml(post, true);
    container.append(mainPostHtml);

    post.replies.forEach((reply) => { 
      const html = createPostHtml(reply);
      container.append(html);
    });
}

// $('#postTextArea').keyup(function (event) {
//   var textArea = event.target;
//   var value = textArea.value.trim();
//   console.log(value );
// });
