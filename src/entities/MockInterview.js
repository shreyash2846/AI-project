export const MockInterview = {
  async create(payload) {
    return {
      ...payload,
      created_at: new Date().toISOString()
    };
  }
};

