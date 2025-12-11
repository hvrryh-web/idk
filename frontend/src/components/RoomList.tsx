import "../styles/RoomList.css";

interface RoomListProps {
  onRoomSelect: (roomId: string) => void;
  selectedRoom: string;
}

export default function RoomList({ onRoomSelect, selectedRoom }: RoomListProps) {
  const rooms = [
    { id: "main", name: "Main Hall" },
    { id: "training", name: "Training Grounds" },
    { id: "library", name: "Sect Library" },
  ];

  return (
    <div className="room-list">
      <h3>Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            className={selectedRoom === room.id ? "selected" : ""}
          >
            <button onClick={() => onRoomSelect(room.id)}>
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
