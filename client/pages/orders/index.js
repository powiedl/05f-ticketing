const OrderIndex = ({ orders }) => {
  if (!orders) return <div>You have no orders yet</div>;
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get('/api/orders');
  //console.log('OrderIndexdata', orders);
  return { orders };
};

export default OrderIndex;
