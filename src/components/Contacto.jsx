import { useState } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { Card, PageTitle, PrimaryButton } from '../styles/StyledComponents';

const Contacto = () => {
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensaje('¡Mensaje enviado! Te contactaremos pronto.');
        toast.success('¡Mensaje enviado! Te contactaremos pronto.');
        e.target.reset();
    };

    return (
        <>
            <Helmet>
                <title>Contacto - Mi Tienda Online</title>
                <meta name="description" content="Contáctanos para cualquier consulta sobre nuestros productos y servicios" />
            </Helmet>

            <Container className="py-5">
                <PageTitle>Contáctanos</PageTitle>
                {mensaje && (
                    <Alert variant="success" className="mt-3">
                        {mensaje}
                    </Alert>
                )}
                
                <Row className="g-4">
                    <Col lg={6}>
                        <Card>
                            <h4 className="mb-4">Envíanos un mensaje</h4>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre completo</Form.Label>
                                    <Form.Control type="text" placeholder="Tu nombre" required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="tu@email.com" required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="tel" placeholder="+1 234 567 890" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={5} 
                                        placeholder="Escribe tu mensaje aquí..." 
                                        required 
                                    />
                                </Form.Group>

                                <PrimaryButton type="submit" className="w-100">
                                    <FaPaperPlane className="me-2" />
                                    Enviar Mensaje
                                </PrimaryButton>
                            </Form>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="h-100">
                            <h4 className="mb-4 text-center">Información de contacto</h4>
                            
                            <div className="d-flex flex-column align-items-center mb-4">
                                <FaEnvelope className="text-primary fs-4 mb-2" />
                                <div className="text-center">
                                    <h6>Email</h6>
                                    <p className="text-muted mb-0">contacto@tienda.com</p>
                                    <p className="text-muted">soporte@tienda.com</p>
                                </div>
                            </div>

                            <div className="d-flex flex-column align-items-center mb-4">
                                <FaPhone className="text-success fs-4 mb-2" />
                                <div className="text-center">
                                    <h6>Teléfono</h6>
                                    <p className="text-muted mb-0">+1 234 567 890</p>
                                    <p className="text-muted">Lun - Vie: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>

                            <div className="d-flex flex-column align-items-center mb-4">
                                <FaMapMarkerAlt className="text-danger fs-4 mb-2" />
                                <div className="text-center">
                                    <h6>Dirección</h6>
                                    <p className="text-muted mb-0">Calle Principal 123</p>
                                    <p className="text-muted">Ciudad, País, CP 12345</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-top text-center">
                                <h6 className="mb-3">Horario de atención</h6>
                                <p className="text-muted mb-1"><strong>Lunes - Viernes:</strong> 9:00 AM - 6:00 PM</p>
                                <p className="text-muted mb-1"><strong>Sábado:</strong> 10:00 AM - 2:00 PM</p>
                                <p className="text-muted mb-0"><strong>Domingo:</strong> Cerrado</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Contacto;