const Header = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '26px',
        // backgroundColor: '#a8f4b4', // green color
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgb(204, 204, 204)',
        fontSize: '14px',
        display: 'grid',
        placeItems: 'center',
        position: 'fixed',
        zIndex: '99',
      }}
    >
      <p style={{ fontWeight: '600' }}>
        WhenIs
        <span style={{ color: '#087f5b' }}>Better</span>
      </p>
    </div>
  );
};

export default Header;
