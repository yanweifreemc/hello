import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Message { 'text' : string, 'time' : Time, 'author' : string }
export type Time = bigint;
export interface _SERVICE {
  'clearfollow' : ActorMethod<[], undefined>,
  'follow' : ActorMethod<[Principal], undefined>,
  'follows' : ActorMethod<[], Array<Principal>>,
  'get_name' : ActorMethod<[], string>,
  'post' : ActorMethod<[string, string], undefined>,
  'posts' : ActorMethod<[Time], Array<Message>>,
  'set_name' : ActorMethod<[string], undefined>,
  'timeline' : ActorMethod<[Time], Array<Message>>,
}
