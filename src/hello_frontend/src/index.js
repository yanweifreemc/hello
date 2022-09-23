import { Principal } from "@dfinity/candid/lib/cjs/idl";
import { hello_backend, idlFactory } from "../../declarations/hello_backend";
import { Actor, HttpAgent } from "@dfinity/agent";

async function post(){
  let error = document.getElementById("error");
  error.innerText = "";
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let otp = document.getElementById("otp").value;
  let text = textarea.value;
  try{
    await hello_backend.post(otp, text);
    textarea.value = "";
  } catch(err){
    console.log(err);
    error.innerText = "Post Failed!";
  }
  post_button.disabled = false;
}

var num_followposts = 0;
async function followposts(id){
  let posts_section = document.getElementById("followposts");

  let follows = await hello_backend.follows();
  let agent = new HttpAgent();
  agent.fetchRootKey();
  let actor = Actor.createActor(idlFactory, {agent : agent, canisterId : follows[0]});
  let posts = await actor.posts();
  //if(num_followposts == posts.length) return;

  posts_section.replaceChildren([]);
  //num_followposts = posts.length;
  for (var i=0; i < posts.length; i++){
    let post = document.createElement("p");
    post.innerText = posts[i].text;
    posts_section.appendChild(post);
  }
}

var num_posts = 0;
async function load_posts(){
  let posts_section = document.getElementById("posts");
  let posts = await hello_backend.posts(0);
  if(num_posts == posts.length) return;

  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for (var i=0; i < posts.length; i++){
    let post = document.createElement("p");
    post.innerText = posts[i].text;
    posts_section.appendChild(post);
  }
}

var num_follows = 0;
async function load_follows(){
  let follows_section = document.getElementById("follows");
  let follows = await hello_backend.follows();
  if(num_follows == follows.length) return;

  follows_section.replaceChildren([]);
  num_follows = follows.length;
  for (var i = 0; i < follows.length; i++){
    let follow = document.createElement("p");
    let agent = new HttpAgent();
    agent.fetchRootKey();
    let actor = Actor.createActor(idlFactory, {agent : agent, canisterId : follows[i]});
    let name = await actor.get_name();
    follow.innerText = name;
    //follow.onclick = followposts(i);
    follows_section.appendChild(follow);
  }
}

var num_timelines = 0;
async function load_timelines(){
  let posts_section = document.getElementById("timelines");
  let posts = await hello_backend.timeline(0);
  if(num_timelines == posts.length) return;

  posts_section.replaceChildren([]);
  num_timelines = posts.length;
  for (var i=0; i < posts.length; i++){
    let post = document.createElement("p");
    let time = new Date(Math.floor(Number(posts[i].time)) / 1000000).toLocaleString();
    post.innerText = posts[i].author + "    " + time + "    " + posts[i].text;
    posts_section.appendChild(post);
  }
}

async function set_name(name){
    await hello_backend.set_name(name);
}

function load() {
  let post_button = document.getElementById("post");
  post_button.onclick = post;

  set_name("yanwei");
  load_posts();
  load_follows();
  load_timelines();
  setInterval(load_posts, 3000);
  setInterval(load_follows, 3000);
  setInterval(load_timelines, 3000);
}

window.onload = load