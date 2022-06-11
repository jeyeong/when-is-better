import Link from 'next/link';

const Header = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '26px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgb(204, 204, 204)',
        fontSize: '14px',
        display: 'grid',
        placeItems: 'center',
        position: 'fixed',
        zIndex: '99',
      }}
    >
      <Link href="/">
        <p style={{ fontWeight: '600', cursor: 'pointer' }}>
          WhenIs
          <span style={{ color: '#087f5b' }}>Better</span>
        </p>
      </Link>
    </div>
  );
};

export default Header;
