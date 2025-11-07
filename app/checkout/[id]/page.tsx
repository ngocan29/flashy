
import CheckoutPage from './CheckoutPage';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '8058f6f7-462f-4c10-8e7a-ac3620bcba9d' },
    { id: '095a766e-2293-4142-9a29-7571402c97c2' },
    { id: '0dfd1b22-19e5-4e59-92b5-a28a521fbea4' },
  ];
}

export default function CheckoutPageWrapper({ params }: { params: { id: string } }) {
  return <CheckoutPage productId={params.id} />;
}
