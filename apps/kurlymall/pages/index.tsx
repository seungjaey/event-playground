import Link from 'next/link';

const MallMainPage = () => (
  <div>
    <h1>대충 컬리홈</h1>
    <ul>
      <li>
        <Link href="/events/1" prefetch={false}>
          Event 1
        </Link>
      </li>
    </ul>
  </div>
);

export default MallMainPage;