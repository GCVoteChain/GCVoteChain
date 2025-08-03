import './css/Layout.css';


const Layout = ({headerContent, mainContent, footerContent}) => {
    return (
        <div className='Layout'>
            <header className='layout-header'>
                <h2>{headerContent}</h2>
            </header>

            <div className='layout-main'>
                <div className='layout-main-center-div'>
                    {mainContent}
                </div>
            </div>

            <footer className='layout-footer'>
                { footerContent ? footerContent : '' }
            </footer>
        </div>
    )
};


export default Layout;