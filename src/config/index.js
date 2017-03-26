export default () => ({
  port: parseInt(process.env.PORT || process.env.NODE_PORT || '9000')
});
