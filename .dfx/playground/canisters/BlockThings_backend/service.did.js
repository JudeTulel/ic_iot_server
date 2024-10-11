export const idlFactory = ({ IDL }) => {
  const ThingId = IDL.Nat;
  const Time = IDL.Int;
  const DataEntry = IDL.Record({ 'value' : IDL.Float64, 'timestamp' : Time });
  const Status = IDL.Record({ 'lastSeen' : Time, 'online' : IDL.Bool });
  const Thing = IDL.Record({
    'id' : ThingId,
    'status' : Status,
    'endpoint' : IDL.Text,
    'name' : IDL.Text,
    'nonce' : IDL.Text,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'status_code' : IDL.Nat16,
  });
  const Main = IDL.Service({
    'getThingData' : IDL.Func([ThingId], [IDL.Vec(DataEntry)], []),
    'getThingDataInRange' : IDL.Func(
        [ThingId, Time, Time],
        [IDL.Vec(DataEntry)],
        [],
      ),
    'getUserThings' : IDL.Func([], [IDL.Vec(Thing)], []),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], []),
    'init' : IDL.Func([], [], []),
    'markThingOnline' : IDL.Func([ThingId], [IDL.Bool], []),
    'registerThing' : IDL.Func([IDL.Text], [Thing], []),
    'removeThing' : IDL.Func([ThingId], [IDL.Bool], []),
    'renameThing' : IDL.Func([ThingId, IDL.Text], [IDL.Bool], []),
    'storeThingData' : IDL.Func([ThingId, IDL.Float64], [IDL.Bool], []),
  });
  return Main;
};
export const init = ({ IDL }) => { return []; };
