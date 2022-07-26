import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import useWindowDimensions from "./useWindowDimentions";
import { useModal } from "../context/modal-context/modal-context";
import { getUsers } from "../services/firebase";
import UserAvatar from "react-user-avatar";
import { Checkbox } from "@mui/material";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function InviteFriendsModal({ updateEditors, presentation }) {
  const screenDimensions = useWindowDimensions();
  const modal = useModal();
  const [editors, setEditors] = useState([]);

  useEffect(() => {}, [editors]);

  useEffect(() => {
    const init = async () => {
      getUsers().then((users) => {
         const data =  users?.filter((u) => u.uid !== presentation.id_user);
         const _editors = data?.reduce((acc, user) => {
            const _user = {
              ...user,
              checked: presentation.editors.filter((e) => e.uid === user.uid).length > 0,
            };
            return [...acc, _user];
         }, [])
         setEditors(_editors);
      })}
      init()
  }, [presentation])

  const userSelected = (user) => {
    const _editors = [...editors];
    const _user = _editors.find((u) => u.uid === user.uid);
    _user.checked = !_user.checked;
    setEditors(_editors);
  }

  const AddEditors = () => {
    const _editors = editors.filter((u) => u.checked);
    updateEditors(_editors.reduce((acc, user) => {
      const {checked, ...rest} = user;
      return [...acc, {...rest}];
    }, []));
    modal.hideModal();
  }

  return (
    <div>
      <Box
        sx={[
          style,
          {
            width:
              screenDimensions.width < 600 ? screenDimensions.width - 20 : 420,
          },
        ]}
      >
        <div
          style={{
            marginBottom: 30,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          onClick={modal.hideModal}
        >
          <CloseIcon />
        </div>

        {editors.map((user, index) => {
         return (
         <div className="flex flex-row my-4" key={index}>
          <div className="">
          <Checkbox   sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} checked={user.checked} onChange={() => userSelected(user)}/>
          </div>
           <UserAvatar size="48" name={user.displayName} src={user?.photoURL} />
           <div className="flex flex-col pl-4">
             <p className="font-semibold">{user.displayName}</p>
             <p className="mt-2 text-gray-400">{user.email}</p>
            </div>
         </div>
        )})}

        <div className="button-container">
          <button className="add-docs" onClick={AddEditors}>
            Add
          </button>
        </div>
      </Box>
    </div>
  );
}
