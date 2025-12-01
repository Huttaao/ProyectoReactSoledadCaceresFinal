import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';
import { StyledFooter } from '../styles/StyledComponents';

function Footer() {
    const year = new Date().getFullYear();
    return (
    <StyledFooter>
        <Container>
        <Row className="text-center">
            <Col md={6} className="mb-3 mb-md-0">
            <h5 className="text-white mb-3">Contacto</h5>
            <div className="d-flex flex-column gap-1">
                <p className="text-white-50 small mb-1">
                <FaEnvelope className="me-2" />
                contacto@tienda.com
                </p>
                <p className="text-white-50 small mb-0">
                <FaPhone className="me-2" />
                +1 234 567 890
                </p>
            </div>
            </Col>
            <Col md={6}>
            <h5 className="text-white mb-3">Síguenos</h5>
            <div className="d-flex justify-content-center gap-3">
                <a href="#" className="text-white-50 fs-4" aria-label="GitHub">
                <FaGithub />
                </a>
                <a href="#" className="text-white-50 fs-4" aria-label="LinkedIn">
                <FaLinkedin />
                </a>
                <a href="#" className="text-white-50 fs-4" aria-label="Twitter">
                <FaTwitter />
                </a>
            </div>
            </Col>
        </Row>
        <hr className="bg-white opacity-25 my-4" />
        <Row>
            <Col className="text-center text-white-50">
            <p className="mb-0 small">
                © {year} Mi Tienda Online. Todos derechos reservados. Desarrollado por Soledad Caceres
            </p>
            </Col>
        </Row>
        </Container>
    </StyledFooter>
    );
}

export default Footer;