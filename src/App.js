import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  //passing onClick as a props
  return (
    <button
      className="button"
    onClick={onClick}>{children}</button>
  )
}

export default function App() {

  const [friends, setFriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show)=>!show);
  }

  function handleAddFriend(friend) {
    // not mutating the original array just adding new object friends
    setFriends((friends) => [...friends, friend]);
    // to hide the the form again
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    // when click on the select for split bill form
    // the addfriend should be closed
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends(
      (friends) =>
        friends.map((friend) =>
          friend.id === selectedFriend.id ?
            { ...friend, balance: friend.balance + value }
            : friend))
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add friend"}</Button>
        
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend}
        onSplitBill={handleSplitBill}
      key={selectedFriend.id}/>}
    </div>
  )
}

function FriendsList({friends,onSelection,selectedFriend}) {
  
  return <ul>
    {friends.map((friend) => <li>
      <Friend friend={friend} key={friend.id}
        selectedFriend={selectedFriend}
        onSelection={onSelection}
         />
     </li>)}
  </ul>
}

function Friend({ friend, onSelection,selectedFriend }) {

  // selectedFriend?.id is optional chaining
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ?"selected":""}>
    <img src={friend.image} alt={friend.name}/>
    
      <h3>{friend.name}</h3>
      
    {friend.balance < 0 &&
      (<p className="red">
        you owe {friend.name} ₹ {Math.abs(friend.balance)}
      </p>)}
    
     {friend.balance > 0 &&
      (<p className="green">
         {friend.name} owes you ₹ {Math.abs(friend.balance)}
      </p>)}
    
     {friend.balance === 0 &&
      (<p>
        you and {friend.name} are even
        </p>)}
      <Button onClick={() => onSelection(friend)}>{isSelected ? "close" : "select"}</Button>
    </li>
  )
}



function FormAddFriend({onAddFriend}) {

  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e){
    e.preventDefault();
    
    if (!name || !image) return ;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      // to get the same image using this URL
      // check https://i.pravatar.cc/48
      // if  you add id to the string then the image does not changes
      image: `${image}?=${id}`,
      balance: 0,
      
    }

    // console.log(newFriend);

    onAddFriend(newFriend);
    //to get back to original state after adding the friend
    setName("");
    setImage("https://i.pravatar.cc/48");

  }
  return (
    <form className="form-add-friend"
    onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e)=>setName(e.target.value)}/>

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e)=>setImage(e.target.value)}/>
   <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend,onSplitBill}) {

  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  //derived state
  // bill is a string for that we are using ternery operation

  const paidByFriend = bill ? bill - paidByUser :"";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e){
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying==="user"? paidByFriend:-paidByUser)

  }

  return (
    <form className="form-split-bill"
      onSubmit={handleSubmit}>
      
      <h2>split a bill with {selectedFriend.name} </h2>

       <label>Bill Value</label>
      <input type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expenses</label>
      <input type="text"
       value={paidByUser}
        onChange={(e) => setPaidByUser(
          // to ensure that friend expense is always less than bill value
          Number(e.target.value) > bill
          ? paidByUser : Number(e.target.value))} />

      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled
      value={paidByFriend} />
      
      <label>Who is paying the bill</label>
      <select
       value={whoIsPaying}
      onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

   <Button>Split Bill</Button>
    </form>
  )
}