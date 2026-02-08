export const NoticeMailTemplate = (notice, user) => `
  <h2>${notice.title}</h2>
  <p>Xin chào ${user.firstname},</p>
  <div>${notice.content}</div>
`;