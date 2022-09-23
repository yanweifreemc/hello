import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
  public type Message = {
    text : Text;
    author : Text;
    time : Time.Time;
  };

  public type Microblog = actor {
    follow: shared(Principal) -> async ();
    unfollow: shared(Principal) -> async ();
    follows: shared query() -> async [Principal];
    post: shared(Text) -> async();   
    posts: shared query(Time.Time) -> async [Message]; 
    timeline : shared (Time.Time) -> async [Message];
    set_name : shared (Text) -> async ();
    get_name : shared () -> async Text;
  };

  stable var followed : List.List<Principal> = List.nil();
  stable var author_name : Text = "";

  public shared func follow(id : Principal) : async (){
    followed := List.push(id, followed);
  };

  public shared func clearfollow() : async (){
    followed := List.nil();
  };

  public shared query func follows() : async [Principal] {
    List.toArray(followed);
  };

  stable var messages : List.List<Message> = List.nil();

  public shared (msg) func post(otp: Text, text : Text) : async (){
    assert(otp == "67890");
    //messages := List.push(text, messages);

    let mpost = {
      text = text;
      time = Time.now();
      author = author_name;
    };
    messages := List.push(mpost, messages);
  };

  public shared query func posts(since: Time.Time) : async [Message] {
    var rlist : List.List<Message> = List.nil();
    for(msg in Iter.fromList(messages)){
      if(msg.time > since){
        rlist := List.push(msg, rlist);
      }
    };
    List.toArray(rlist);
  };

  public shared func timeline(since: Time.Time) : async [Message] {
    var all : List.List<Message> = List.nil();

    for(id in Iter.fromList(followed)){
      let canister : Microblog = actor(Principal.toText(id));
      let msgs = await canister.posts(since);
      for(msg in Iter.fromArray(msgs)){
        all := List.push(msg, all);
      }
    };

    List.toArray(all);
  };

  public shared func set_name(name: Text) : async (){
    author_name := name;
  };

  public shared func get_name() : async Text {
    author_name;
  };
  
};
