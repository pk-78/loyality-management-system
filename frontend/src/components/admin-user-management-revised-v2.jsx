import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, Trash2, UserPlus } from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([
    { id: 'USR001', name: 'John Doe', password: '********', role: 'Admin' },
    { id: 'USR002', name: 'Jane Smith', password: '********', role: 'Staff' },
    { id: 'USR003', name: 'Bob Johnson', password: '********', role: 'Staff' },
  ]);

  const [newUser, setNewUser] = useState({ id: '', name: '', password: '', role: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddUser = () => {
    setUsers([...users, { ...newUser }]);
    setNewUser({ id: '', name: '', password: '', role: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="id">User ID</Label>
                  <Input
                    id="id"
                    value={newUser.id}
                    onChange={(e) => setNewUser({...newUser, id: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
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
              <div key={user.id} className="grid grid-cols-5 gap-4 p-2 border-b">
                <div>{user.id}</div>
                <div>{user.name}</div>
                <div>{user.password}</div>
                <div>{user.role}</div>
                <div>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
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
                              value={editingUser.id}
                              onChange={(e) => setEditingUser({...editingUser, id: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingUser.name}
                              onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-password">Password</Label>
                            <Input
                              id="edit-password"
                              type="password"
                              value={editingUser.password}
                              onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-role">Role</Label>
                            <Select 
                              onValueChange={(value) => setEditingUser({...editingUser, role: value})}
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
                  <Button variant="outline" size="sm" className="ml-2" onClick={() => handleDeleteUser(user.id)}>
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
