import { getInfo, login as Login } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import { defaultAvatar } from '@/config';
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: defaultAvatar,
    userId: 0
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
    window.sessionStorage.setItem('name', name);
  },
  SET_AVATAR: (state, avatar) => {
    avatar && (state.avatar = avatar);
  },
  SET_USER_ID: (state, userId) => {
    userId && (state.userId = userId);
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      Login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit('SET_TOKEN', data.token);
          commit('SET_NAME', data.username);
          commit('SET_AVATAR', data.avatar);
          commit('SET_USER_ID', data.user_id);
          setToken(data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { username, avatar } = response;
          commit('SET_NAME', username);
          commit('SET_AVATAR', avatar);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit('RESET_STATE');
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
