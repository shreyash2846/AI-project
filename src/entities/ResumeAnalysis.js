export const ResumeAnalysis = {
  async create(payload) {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      created_at: new Date().toISOString(),
      ...payload
    };
  }
};

