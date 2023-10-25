//const clientId = "ca6139e49c5bf36";
// const clientId = "712645836bdd60b";
const clientId = "4cbe7854ff837e2";
var defaultAlbumId = "Jfni3";

function requestAlbumXHR() {
  let albumId = document.getElementById("albumIdField").innerText;
  if (!albumId) {
    albumId = defaultAlbumId;
  }
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      processAlbumRequest(req.responseText);
    } else if (req.readyState == 4 && req.status != 200) {
      console.log(req.status + " Error with the imgur API: ", req.responseText);
    }
  };
  req.open("GET", "https://api.imgur.com/3/album/" + albumId + "/images", true); // true for asynchronous
  req.setRequestHeader("Authorization", "Client-ID " + clientId);
  req.send();
}

function requestImageXHR(imageHash) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      processImageRequest(req.responseText);
    } else if (req.readyState == 4 && req.status != 200) {
      console.log("Error with the imgur API");
    }
  };
  req.open("GET", "https://api.imgur.com/3/image/" + imageHash, true); // true for asynchronous
  req.setRequestHeader("Authorization", "Client-ID " + clientId);
  req.send();
}

function requestAlbumFetchPromise() {
  let albumId = document.getElementById("albumIdField").innerText;
  if (!albumId) {
    albumId = defaultAlbumId;
  }
  const url = "https://api.imgur.com/3/album/" + albumId + "/images";
  fetch(url, {
    headers: {
      'Authorization': `Client-ID ${clientId}`,
    },
  })
    .then((res) => res.json())
    .then((images) => {
      for (item of images.data.slice(0, 10)) {
        console.log(item);
        requestImageFetchPromise(item.id);
      }
    })
    .catch((e) => console.error("Error: " + e));
}

function requestImageFetchPromise(imageHash) {
  const url = "https://api.imgur.com/3/image/" + imageHash;
  fetch(url, {
    headers: {
      'Authorization': `Client-ID ${clientId}`,
    },
  })
    .then((res) => res.json())
    .then((image) => {
      let imgElem = document.createElement("img");
      imgElem.src = image.data.link;
      document.body.appendChild(imgElem);
    })
    .catch((e) => console.error("Error: " + e));
}

async function requestAlbumAsyncAwait() {
  let albumId = document.getElementById("albumIdField").innerText;
  if (!albumId) {
    albumId = defaultAlbumId;
  }
  const url = "https://api.imgur.com/3/album/" + albumId + "/images";
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${clientId}`,
      },
    });
    if (res.ok) {
      const images = await res.json();
      for (item of images.data.slice(0, 10)) {
        console.log(item);
        requestImageAsyncAwait(item.id);
      }
    }
  } catch (error) {
    console.error("Error: " + error);
  }
}

async function requestImageAsyncAwait(imageHash) {
  const url = "https://api.imgur.com/3/image/" + imageHash;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Client-ID ${clientId}`,
    },
  });
  const image = await res.json()
  let imgElem = document.createElement("img");
  imgElem.src = image.data.link;
  document.body.appendChild(imgElem);
}

function processAlbumRequest(response_text) {
  var respObj = JSON.parse(response_text);
  for (item of respObj.data.slice(0, 10)) {
    console.log(item);
    requestImageXHR(item.id);
  }
}

function processImageRequest(response_text) {
  var respObj = JSON.parse(response_text);
  let imgElem = document.createElement("img");
  imgElem.src = respObj.data.link;
  //imgElem.referrerpolicy="no-referrer";
  document.body.appendChild(imgElem);
}
