import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Edit, Trash2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import axiosInstance from "../services/axiosConfig";
import toast from "react-hot-toast";
import { url } from "../services/Url";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]); // Set an empty array initially

  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    password: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch users when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${url}/user/getAllUsers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const getData = await response.json();
        setUsers(getData.users);
        console.log("Users data:", getData.users);
      } catch (error) {
        console.error("Error fetching users:", error); // Handle any errors
      }
    }

    fetchUsers();
  }, []);
  function OnSubmit(data) {
    console.log(data); // This will log the form data

    axiosInstance
      .post(`${url}/user/register`, data)
      .then((response) => {
        console.log("Success:", response.data);
        toast.success("User Added Successfully");
        setIsAddDialogOpen(false);
        setUsers([...users, response.data.user]); // Add new user to state
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleEditUser = async (userId) => {
    console.log("ye le", editingUser.userId);
    console.log("ye le name", editingUser.name);
    console.log("ye le password", editingUser.password);
    console.log("ye le role", editingUser.role);
    try {
      const response = await axiosInstance.patch(
        `${url}/user/users/${editingUser.userId}`, // The PATCH request URL
        {
          userId: editingUser.userId,
          name: editingUser.name,
          password: editingUser.password,
          role: editingUser.role,
        }
      );

      console.log("Success:", response.data);
      toast.success("User updated successfully");

      // Update the local state with the updated user data
      setUsers(
        users.map((user) =>
          user.userId === editingUser.userId ? response.data.user : user
        )
      );
      setIsEditDialogOpen(false); // Close the edit dialog
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
    setEditingUser(false);
  };

  async function handleDeleteUser(userId) {
    console.log("delete krna h", userId);
    try {
      const response = await axiosInstance.delete(
        `${url}/user/users/${userId}`
      );
      console.log(response.data); // Success message or response from the server
      toast.success("User deleted Succesfully");
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
    }

    setUsers(users.filter((user) => user.userId !== userId)); // Remove the user from the list
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit(OnSubmit)}>
                <div>
                  <Label htmlFor="id">User ID</Label>
                  <Input
                    id="id"
                    {...register("userId", {
                      required: "This field is required",
                    })}
                  />
                  {errors.userId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.userId?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "This field is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "This field is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="role" className="mb-4">
                    Role
                  </Label>
                  <select
                    id="role"
                    name="role"
                    {...register("role", {
                      required: "Role is required",
                    })}
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <Button type="submit">Add User</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-4 font-bold mb-2 p-2 bg-gray-100">
              <div>User ID</div>
              <div>Name</div>
              <div>Password</div>
              <div>Role</div>
              <div>Actions</div>
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-5 gap-4 p-2 border-b"
              >
                <div>{user.userId}</div>
                <div>{user.name}</div>
                <div>{user.password}</div>
                <div>{user.role}</div>
                <div>
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      {editingUser && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-id">User ID</Label>
                            <Input
                              id="edit-id"
                              value={editingUser.userId}
                              disable="true"
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  id: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingUser.name}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-password">Password</Label>
                            <Input
                              id="edit-password"
                              type="password"
                              value={editingUser.password}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  password: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                              onValueChange={(value) =>
                                setEditingUser({ ...editingUser, role: value })
                              }
                              defaultValue={editingUser.role}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleEditUser}>Save Changes</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteUser(user.userId)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;

// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { User, Edit, Trash2, UserPlus } from "lucide-react";
// import { useForm } from "react-hook-form";

// import axiosInstance from "../services/axiosConfig";
// import toast from "react-hot-toast";
// import { url } from "../services/Url";

// const AdminUserManagement = () => {
//   const [users, setUsers] = useState([
//     { id: "USR001", name: "John Doe", password: "********", role: "Admin" },
//     { id: "USR002", name: "Jane Smith", password: "********", role: "Staff" },
//     { id: "USR003", name: "Bob Johnson", password: "********", role: "Staff" },
//   ]);

//   const [newUser, setNewUser] = useState({
//     id: "",
//     name: "",
//     password: "",
//     role: "",
//   });
//   const [editingUser, setEditingUser] = useState(null);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedType, setSelectedType] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   function optionHandler(event) {
//     // const value = e.target.value === "" ? null : e.target.value;
//     // console.log(value); // Logs null initially, or the selected value
//     const { value } = event.target;
//     value === "" ? null : event.target;
//     console.log(value); // Logs null initially, or the selected value

//     setSelectedType(value);
//   }

//   function OnSubmit(data) {
//     console.log(data); // This will log the form data

//     axiosInstance
//       .post(`${url}/user/register`, data)
//       .then((response) => {
//         console.log("Success:", response.data);
//         toast.success("User Added Successfully");
//         setIsAddDialogOpen(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }

//   const handleAddUser = () => {
//     setUsers([...users, { ...newUser }]);
//     setNewUser({ id: "", name: "", password: "", role: "" });
//     setIsAddDialogOpen(false);
//   };

//   async function fetchUsers() {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/v1/user/getAllUsers",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const getData = await response.json(); // Convert the response to JSON
//       console.log("Users data:", getData.users); // Log the users data

//       return getData; // Return the data if needed
//     } catch (error) {
//       console.error("Error fetching users:", error); // Handle any errors
//     }
//   }
//   fetchUsers();
//   // console.log("ye le", getData);

//   const handleEditUser = (data) => {
//     setUsers(
//       users.map((user) => (user.id === editingUser.id ? editingUser : user))
//     );
//     axiosInstance
//       .put(`${url}/user/users`, data)
//       .then((response) => {
//         console.log("Success:", response.data);
//         toast.success("User changed Successfully");
//         setIsAddDialogOpen(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//     setIsEditDialogOpen(false);
//   };

//   const handleDeleteUser = (id) => {
//     setUsers(users.filter((user) => user.id !== id));
//   };

//   return (
//     <div className="p-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>User Management</CardTitle>
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <UserPlus className="mr-2 h-4 w-4" /> Add New User
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add New User</DialogTitle>
//               </DialogHeader>
//               <form className="space-y-4" onSubmit={handleSubmit(OnSubmit)}>
//                 <div>
//                   <Label htmlFor="id">User ID</Label>
//                   <Input
//                     id="id"
//                     {...register("userId", {
//                       required: "This field is required",
//                     })}
//                   />
//                   {errors.userId && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.userId?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="name">Name</Label>
//                   <Input
//                     id="name"
//                     {...register("name", {
//                       required: "This field is required",
//                     })}
//                   />
//                   {errors.name && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.name?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     {...register("password", {
//                       required: "This field is required",
//                     })}
//                   />
//                   {errors.password && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.password?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   {/* <Label htmlFor="role">Role</Label> */}
//                   {/* <Select
//                     {...register("role", {
//                       required: "This field is required",
//                     })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Admin">Admin</SelectItem>
//                       <SelectItem value="Staff">Staff</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {errors.role && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.role?.message}
//                     </p>
//                   )} */}

//                   <div className="flex flex-col">
//                     <label for="role">Role</label>
//                     <select
//                       id="role"
//                       name="role"
//                       onChange={optionHandler}
//                       {...register("role", {
//                         required: "Answer type is required",
//                       })}
//                     >
//                       <option value="">Select Role</option>
//                       <option value="Admin">Admin</option>
//                       <option value="Staff">Staff</option>
//                     </select>
//                   </div>
//                 </div>

//                 <Button type="submit">Add User</Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//   <div className="grid grid-cols-5 gap-4 font-bold mb-2 p-2 bg-gray-100">
//   <div>User ID</div>
//   <div>Name</div>
//   <div>Password</div>
//   <div>Role</div>
//   <div>Actions</div>
// </div>
// {users.map((user) => (
//   <div
//     key={user.id}
//     className="grid grid-cols-5 gap-4 p-2 border-b"
//   >
//     <div>{user.userId}</div>
//     <div>{user.name}</div>
//     <div>{user.password}</div>
//     <div>{user.role}</div>
//     <div>
//       <Dialog
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//       >
//         <DialogTrigger asChild>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setEditingUser(user)}
//           >
//             <Edit className="h-4 w-4 mr-1" /> Edit
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//           </DialogHeader>
//                       {editingUser && (
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="edit-id">User ID</Label>
//                             <Input
//                               id="edit-id"
//                               value={editingUser.id}
//                               onChange={(e) =>
//                                 setEditingUser({
//                                   ...editingUser,
//                                   id: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="edit-name">Name</Label>
//                             <Input
//                               id="edit-name"
//                               value={editingUser.name}
//                               onChange={(e) =>
//                                 setEditingUser({
//                                   ...editingUser,
//                                   name: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="edit-password">Password</Label>
//                             <Input
//                               id="edit-password"
//                               type="password"
//                               value={editingUser.password}
//                               onChange={(e) =>
//                                 setEditingUser({
//                                   ...editingUser,
//                                   password: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="edit-role">Role</Label>
//                             <Select
//                               onValueChange={(value) =>
//                                 setEditingUser({ ...editingUser, role: value })
//                               }
//                               defaultValue={editingUser.role}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select role" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Admin">Admin</SelectItem>
//                                 <SelectItem value="Staff">Staff</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                           <Button onClick={handleEditUser}>Save Changes</Button>
//                         </div>
//                       )}
//                     </DialogContent>
//                   </Dialog>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="ml-2"
//                     onClick={() => handleDeleteUser(user.id)}
//                   >
//                     <Trash2 className="h-4 w-4 mr-1" /> Delete
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminUserManagement;
