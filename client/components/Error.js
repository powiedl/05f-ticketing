const Error = ({ errors }) => {
  if (!errors) return <></>;
  if (errors.length === 0) return <></>;
  return (
    <div className='alert alert-danger'>
      <h4>Ooops....</h4>
      <ul className='my-0'>
        {errors.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Error;
