export const buildPageLink = (req, targetPage) => {
  if (!targetPage) return null;

  const params = new URLSearchParams(req.query);
  params.set("page", targetPage);

  return `${req.protocol}://${req.get("host")}${req.path}?${params.toString()}`;
};
