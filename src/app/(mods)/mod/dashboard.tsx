'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Trash2, Edit, Plus, Check, X, RefreshCw } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getBubblers, updateBubbler, deleteBubbler, createBubbler,
  getUsers, updateUser, deleteUser, createUser,
  getReviews, deleteReview,
  getReports, resolveReport,
  getStats, getRecentContributions,
  getLogs
} from './actions';

export default function Dashboard({ user }: { user: any }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
        <p className="text-muted-foreground">{greeting}, {user?.name || user?.email || 'Moderator'}</p>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bubblers">Bubblers</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="bubblers"><BubblersTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="reviews"><ReviewsTab /></TabsContent>
        <TabsContent value="reports"><ReportsTab /></TabsContent>
        <TabsContent value="logs"><LogsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, c] = await Promise.all([getStats(), getRecentContributions()]);
        setStats(s);
        setContributions(c);
      } catch (e) {
        toast.error('Failed to load overview');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bubblers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.bubblers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.reviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats?.pendingReports}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Bubbler</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.action}</TableCell>
                  <TableCell>{item.bubbler?.name || 'Unknown'}</TableCell>
                  <TableCell>{item.user?.name || item.userId || 'System'}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function BubblersTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBubblers(page, 20, search);
      setData(res.data);
      setTotalPages(res.metadata.totalPages);
    } catch (e) {
      toast.error('Failed to load bubblers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteBubbler(id);
      toast.success('Bubbler deleted');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editing) {
        await updateBubbler(editing.id, formData);
        toast.success('Bubbler updated');
      } else {
        await createBubbler(formData);
        toast.success('Bubbler created');
      }
      setEditing(null);
      setIsCreating(false);
      load();
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4 gap-4">
        <Input 
          placeholder="Search bubblers..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
          <Button onClick={() => setIsCreating(true)}><Plus className="mr-2 h-4 w-4" /> Add Bubbler</Button>
        </div>
      </div>
      
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Lat/Lng</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Maintainer</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={item.name}>{item.name}</TableCell>
                  <TableCell>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</TableCell>
                  <TableCell className="max-w-[100px] truncate" title={item.region}>{item.region}</TableCell>
                  <TableCell className="max-w-[100px] truncate" title={item.maintainer}>{item.maintainer}</TableCell>
                  <TableCell className="max-w-[100px] truncate" title={item.addedByUserId}>{item.addedByUserId}</TableCell>
                  <TableCell>{item.verified ? <Check className="text-green-500 h-4 w-4" /> : <X className="text-red-500 h-4 w-4" />}</TableCell>
                  <TableCell>{item.approved ? <Check className="text-green-500 h-4 w-4" /> : <X className="text-red-500 h-4 w-4" />}</TableCell>
                  <TableCell className="whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  <PageInput page={page} totalPages={totalPages} onPageChange={setPage} />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={!!editing || isCreating} onOpenChange={(open) => { if (!open) { setEditing(null); setIsCreating(false); } }}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Bubbler' : 'Create Bubbler'}</DialogTitle>
          </DialogHeader>
          <BubblerForm initialData={editing} onSubmit={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BubblerForm({ initialData, onSubmit }: { initialData?: any, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState(initialData || {
    name: '', latitude: 0, longitude: 0, description: '', verified: false, approved: false, region: '', maintainer: '', amenities: [], image: '', addedByUserId: ''
  });

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div><Label>Name</Label><Input value={formData.name} onChange={e => handleChange('name', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Latitude</Label><Input type="number" value={formData.latitude} onChange={e => handleChange('latitude', parseFloat(e.target.value))} /></div>
        <div><Label>Longitude</Label><Input type="number" value={formData.longitude} onChange={e => handleChange('longitude', parseFloat(e.target.value))} /></div>
      </div>
      <div><Label>Description</Label><Textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} /></div>
      <div><Label>Region</Label><Input value={formData.region || ''} onChange={e => handleChange('region', e.target.value)} /></div>
      <div><Label>Maintainer</Label><Input value={formData.maintainer || ''} onChange={e => handleChange('maintainer', e.target.value)} /></div>
      <div><Label>Image URL</Label><Input value={formData.image || ''} onChange={e => handleChange('image', e.target.value)} /></div>
      <div><Label>Added By User ID</Label><Input value={formData.addedByUserId || ''} onChange={e => handleChange('addedByUserId', e.target.value)} /></div>
      <div>
        <Label>Amenities (comma separated)</Label>
        <Input 
          value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : formData.amenities || ''} 
          onChange={e => handleChange('amenities', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} 
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.verified} onCheckedChange={c => handleChange('verified', c)} />
          <Label>Verified</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.approved} onCheckedChange={c => handleChange('approved', c)} />
          <Label>Approved</Label>
        </div>
      </div>
      <Button onClick={() => onSubmit(formData)} className="w-full">Save</Button>
    </div>
  );
}

function UsersTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers(search);
      setData(res);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editing) {
        await updateUser(editing.id, formData);
        toast.success('User updated');
      } else {
        await createUser(formData);
        toast.success('User created');
      }
      setEditing(null);
      setIsCreating(false);
      load();
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4 gap-4">
        <Input 
          placeholder="Search users..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
          <Button onClick={() => setIsCreating(true)}><Plus className="mr-2 h-4 w-4" /> Add User</Button>
        </div>
      </div>
      
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Handle</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>XP</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[100px] truncate" title={item.id}>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.displayName}</TableCell>
                  <TableCell>{item.handle}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.xp}</TableCell>
                  <TableCell>
                    {item.moderator && <span className="text-red-500 font-bold mr-2">MOD</span>}
                    {item.verified && <span className="text-blue-500 font-bold">VERIFIED</span>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editing || isCreating} onOpenChange={(open) => { if (!open) { setEditing(null); setIsCreating(false); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit User' : 'Create User'}</DialogTitle></DialogHeader>
          <UserForm initialData={editing} onSubmit={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserForm({ initialData, onSubmit }: { initialData: any, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div><Label>ID (Optional/Editable)</Label><Input value={formData.id || ''} onChange={e => handleChange('id', e.target.value)} /></div>
      <div><Label>Name</Label><Input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} /></div>
      <div><Label>Display Name</Label><Input value={formData.displayName || ''} onChange={e => handleChange('displayName', e.target.value)} /></div>
      <div><Label>Handle</Label><Input value={formData.handle || ''} onChange={e => handleChange('handle', e.target.value)} /></div>
      <div><Label>Email</Label><Input value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} /></div>
      <div><Label>Email Verified (ISO Date)</Label><Input value={formData.emailVerified || ''} onChange={e => handleChange('emailVerified', e.target.value)} /></div>
      <div><Label>Bio</Label><Textarea value={formData.bio || ''} onChange={e => handleChange('bio', e.target.value)} /></div>
      <div><Label>Image URL</Label><Input value={formData.image || ''} onChange={e => handleChange('image', e.target.value)} /></div>
      <div><Label>XP</Label><Input type="number" value={formData.xp} onChange={e => handleChange('xp', parseInt(e.target.value))} /></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.moderator} onCheckedChange={c => handleChange('moderator', c)} />
          <Label>Moderator</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.verified} onCheckedChange={c => handleChange('verified', c)} />
          <Label>Verified</Label>
        </div>
      </div>
      <Button onClick={() => onSubmit(formData)} className="w-full">Save</Button>
    </div>
  );
}

function ReviewsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getReviews(search);
      setData(res);
    } catch (e) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4 gap-4">
        <Input 
          placeholder="Search reviews..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm"
        />
        <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
      </div>
      
      {loading ? <Loader2 className="animate-spin" /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Bubbler</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.user?.name || item.userId}</TableCell>
                <TableCell>{item.bubbler?.name || item.bubblerId}</TableCell>
                <TableCell>{item.rating}</TableCell>
                <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function ReportsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getReports(search);
      setData(res);
    } catch (e) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const handleResolve = async (id: number) => {
    try {
      await resolveReport(id);
      toast.success('Report resolved');
      load();
    } catch (e) {
      toast.error('Failed to resolve');
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4 gap-4">
        <Input 
          placeholder="Search reports..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm"
        />
        <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
      </div>
      
      {loading ? <Loader2 className="animate-spin" /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.reporter?.name || item.reporterId}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.resolved ? <span className="text-green-500">Resolved</span> : <span className="text-yellow-500">Open</span>}</TableCell>
                <TableCell>
                  {!item.resolved && (
                    <Button size="sm" onClick={() => handleResolve(item.id)}>Resolve</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function PageInput({ page, totalPages, onPageChange }: { page: number, totalPages: number, onPageChange: (p: number) => void }) {
  const [val, setVal] = useState(page.toString());
  
  useEffect(() => { setVal(page.toString()); }, [page]);

  const handleCommit = () => {
    const p = parseInt(val);
    if (p && p >= 1 && p <= totalPages) {
      onPageChange(p);
    } else {
      setVal(page.toString());
    }
  };

  return (
    <input 
      type="number" 
      value={val} 
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
      className="w-12 text-center bg-transparent border-none focus:ring-0 p-0"
    />
  );
}

function LogsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getLogs(page, 20, search);
      setData(res.data);
      setTotalPages(res.metadata.totalPages);
    } catch (e) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search]);

  return (
    <div>
      <div className="flex justify-between mb-4 gap-4">
        <Input 
          placeholder="Search logs..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm"
        />
        <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
      </div>
      
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Bubbler</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="capitalize">{item.action}</TableCell>
                  <TableCell>{item.bubbler?.name || item.bubblerId}</TableCell>
                  <TableCell>{item.user?.name || item.userId || 'System'}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Log Details #{item.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-bold mb-2">Old Data</h3>
                            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-[300px]">
                              {JSON.stringify(item.oldData, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <h3 className="font-bold mb-2">New Data</h3>
                            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-[300px]">
                              {JSON.stringify(item.newData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  <PageInput page={page} totalPages={totalPages} onPageChange={setPage} />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
