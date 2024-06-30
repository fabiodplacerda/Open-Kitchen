const Loader = () => {
  return (
    <div className="loading d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle">
      <div className="loader"></div>
      <p className="fs-2 text-white">Loading content</p>
    </div>
  );
};

export default Loader;
