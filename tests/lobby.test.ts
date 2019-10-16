// import { Ast } from "astra-engine";

import * as socketIO from "socket.io-client";

// describe("owo", () => {
//   let io = socketIO();
//   let lobbyManager: LobbyManager;
//   it("create lobby manager", () => {
//     lobbyManager = new LobbyManager();
//     let player: Player;
//     player = new Player("1488", "dane4ka", io);
//     let lobbyId = lobbyManager.search(player);

//     expect(lobbyManager.connections.has("1488")).toBe(true);
//     expect(lobbyManager.players.has(player.id)).toBe(true);
//     expect(lobbyManager.lobbies.has(lobbyId)).toBe(true);

//     const lobby = lobbyManager.getLobby(lobbyId);
//     lobby.state.syncAll();

//     lobbyManager.leave(player.id);

//     expect(lobbyManager.connections.has("1488")).toBe(false);
//     expect(lobbyManager.players.has(player.id)).toBe(false);
//     expect(lobbyManager.lobbies.has(lobbyId)).toBe(false);
//   });
// });
