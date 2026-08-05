import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const mockUser = {
  id: 'USR-001',
  name: 'Dr. Admin User',
  email: 'admin@medicore.com',
  password: 'admin123',
  role: 'Administrator',
  avatar: null,
  phone: '+1-555-0001',
  department: 'Administration',
  joinDate: '2020-03-15',
};

// Retrieve registered users list from localStorage
const getRegisteredUsers = () => {
  const users = localStorage.getItem('registered_users');
  return users ? JSON.parse(users) : [mockUser];
};

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  await new Promise((r) => setTimeout(r, 600));
  const registered = getRegisteredUsers();

  // 1. Check Admin Credentials
  if (email.toLowerCase() === 'admin@medicore.com' && password === 'admin123') {
    const { password: _, ...adminUser } = mockUser;
    return { user: adminUser, token: `mock-jwt-token-admin` };
  }

  // 2. Check Registered Users in LocalStorage
  const existingUser = registered.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password ? u.password === password : true)
  );

  if (existingUser) {
    const { password: _, ...userWithoutPassword } = existingUser;
    return { user: userWithoutPassword, token: `mock-jwt-token-${Date.now()}` };
  }

  // 3. Reject any other unregistered user
  return rejectWithValue('Invalid User! Account does not exist. Please register first.');
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  await new Promise((r) => setTimeout(r, 800));
  try {
    const registered = getRegisteredUsers();
    if (registered.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return rejectWithValue('An account with this email address already exists.');
    }
    
    // Save new user data into localStorage
    const newUser = {
      id: `USR-${Math.floor(Math.random() * 900 + 100)}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'Staff Member',
      avatar: null,
      phone: userData.phone || '+1-555-0100',
      department: userData.department || 'General Practice',
      joinDate: new Date().toISOString().split('T')[0],
    };

    registered.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registered));

    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token: `mock-jwt-token-${Date.now()}` };
  } catch (err) {
    return rejectWithValue('Registration failed. Please try again.');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }) => {
  await new Promise((r) => setTimeout(r, 600));
  return { message: `Password reset link sent to ${email}` };
});

const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Invalid User! Account does not exist.';
      })
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      .addCase(forgotPassword.pending, (state) => { state.status = 'loading'; })
      .addCase(forgotPassword.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(forgotPassword.rejected, (state) => { state.status = 'failed'; });
  },
});

export const { logout, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
