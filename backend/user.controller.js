const users = [];

const addUser = ({ id, name, room }) => {
  // const Tname = name.trim().toLowerCase();
  // const Troom = room.trim().toLowerCase();
  const roomMember = users.find(
    (user) => user.room === room && user.name === name
  );

  if (roomMember) {
    return { serverError: "User name is already taken" };
  } else {
    const user = { id, name, room };
    users.push(user);
    return { user };
  }
};

const removeUser = (id) => {
  // better than filtering
  const index = users.findIndex((user) => user.id === id);
  // if user found
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

const getUsersOfRoom = (room) => {
  const allUsers = users.filter((user) => user.room === room);
  return allUsers;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersOfRoom,
};
