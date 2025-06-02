import reducer, {
  registerUser,
  loginUser,
  checkAuth,
  forgotPassword,
  resetPassword,
  fetchUser,
  updateUser,
  logout
} from './userSlice';

describe('user reducer', () => {
  const initialState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
    forgotLoading: false,
    forgotError: null,
    resetLoading: false,
    resetError: null,
    getUserLoading: false,
    getUserError: null,
    updateLoading: false,
    updateError: null,
    logoutLoading: false,
    logoutError: null
  };

  const mockUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('registerUser', () => {
    it('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        registerLoading: true,
        registerError: null
      });
    });

    it('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        registerLoading: false,
        user: mockUser
      });
    });

    it('should handle registerUser.rejected', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        registerLoading: false,
        registerError: errorMessage
      });
    });
  });

  describe('loginUser', () => {
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loginLoading: true,
        loginError: null
      });
    });

    it('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loginLoading: false,
        user: mockUser
      });
    });

    it('should handle loginUser.rejected', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loginLoading: false,
        loginError: errorMessage
      });
    });
  });

  describe('checkAuth', () => {
    it('should handle checkAuth.pending', () => {
      const action = { type: checkAuth.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        getUserLoading: true,
        getUserError: null
      });
    });

    it('should handle checkAuth.fulfilled', () => {
      const action = {
        type: checkAuth.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        getUserLoading: false,
        user: mockUser
      });
    });

    it('should handle checkAuth.rejected', () => {
      const errorMessage = 'Auth check failed';
      const action = {
        type: checkAuth.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        getUserLoading: false,
        getUserError: errorMessage
      });
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgotPassword.pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        forgotLoading: true,
        forgotError: null
      });
    });

    it('should handle forgotPassword.fulfilled', () => {
      const action = { type: forgotPassword.fulfilled.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        forgotLoading: false
      });
    });

    it('should handle forgotPassword.rejected', () => {
      const errorMessage = 'Password reset request failed';
      const action = {
        type: forgotPassword.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        forgotLoading: false,
        forgotError: errorMessage
      });
    });
  });

  describe('resetPassword', () => {
    it('should handle resetPassword.pending', () => {
      const action = { type: resetPassword.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        resetLoading: true,
        resetError: null
      });
    });

    it('should handle resetPassword.fulfilled', () => {
      const action = { type: resetPassword.fulfilled.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        resetLoading: false
      });
    });

    it('should handle resetPassword.rejected', () => {
      const errorMessage = 'Password reset failed';
      const action = {
        type: resetPassword.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        resetLoading: false,
        resetError: errorMessage
      });
    });
  });

  describe('fetchUser', () => {
    it('should handle fetchUser.pending', () => {
      const action = { type: fetchUser.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        getUserLoading: true,
        getUserError: null
      });
    });

    it('should handle fetchUser.fulfilled', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        getUserLoading: false,
        user: mockUser
      });
    });

    it('should handle fetchUser.rejected', () => {
      const errorMessage = 'Failed to fetch user';
      const action = {
        type: fetchUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        getUserLoading: false,
        getUserError: errorMessage
      });
    });
  });

  describe('updateUser', () => {
    it('should handle updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        updateLoading: true,
        updateError: null
      });
    });

    it('should handle updateUser.fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: { user: updatedUser }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        updateLoading: false,
        user: updatedUser
      });
    });

    it('should handle updateUser.rejected', () => {
      const errorMessage = 'Failed to update user';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        updateLoading: false,
        updateError: errorMessage
      });
    });
  });

  describe('logout', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser
    };

    it('should handle logout.pending', () => {
      const action = { type: logout.pending.type };
      const state = reducer(stateWithUser, action);

      expect(state).toEqual({
        ...stateWithUser,
        logoutLoading: true,
        logoutError: null
      });
    });

    it('should handle logout.fulfilled', () => {
      const action = { type: logout.fulfilled.type };
      const state = reducer(stateWithUser, action);

      expect(state).toEqual({
        ...initialState,
        logoutLoading: false,
        user: null
      });
    });

    it('should handle logout.rejected', () => {
      const errorMessage = 'Failed to logout';
      const action = {
        type: logout.rejected.type,
        payload: errorMessage
      };
      const state = reducer(stateWithUser, action);

      expect(state).toEqual({
        ...stateWithUser,
        logoutLoading: false,
        logoutError: errorMessage
      });
    });
  });
});
