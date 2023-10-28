let peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;
document.addEventListener("message", function (event) {
    if(window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(event.data);
    }
});
const SendMassege = ()=>{
    // window.parent.postMessage("I'm loaded", "*");
    if(window.ReactNativeWebView) {
        alert("kk")
    window.ReactNativeWebView.postMessage.postMessage("I'm loaded", "*");
    }else{
        alert("not avaliable");
    }
}
window.onload = ()=>{
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get("roomId");
const ApiKey = urlParams.get("ApiKey");
const AccessToken = urlParams.get("AccessToken");
if(roomId && ApiKey && AccessToken)
{
 window.parent.postMessage("I'm loaded", "*");
}else{
    console.log(urlParams.get("roomId"));
}

}
let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    remoteStream = new MediaStream()
    document.getElementById('user-1').srcObject = localStream
    document.getElementById('user-2').srcObject = remoteStream;
    document.getElementById('user-2').style.opacity = 0;
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
        });
    };
}

let createOffer = async () => {
    peerConnection.onicecandidate = async (event) => {
        //Event that fires off when a new offer ICE candidate is created
        if(event.candidate){
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
}

let createAnswer = async () => {

    let offer = JSON.parse(document.getElementById('offer-sdp').value)

    peerConnection.onicecandidate = async (event) => {
        //Event that fires off when a new answer ICE candidate is created
        if(event.candidate){
            console.log('Adding answer candidate...:', event.candidate)
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    };

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer); 
}

let addAnswer = async () => {
    console.log('Add answer triggerd')
    let answer = JSON.parse(document.getElementById('answer-sdp').value)
    console.log('answer:', answer)
    if (!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer);
    }
}

init()

// document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('add-answer').addEventListener('click', addAnswer)
