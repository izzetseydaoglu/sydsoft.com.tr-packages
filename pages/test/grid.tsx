import { Col, Hidden, Row } from "@/@base/grid";
import React, { useState } from "react";

const GridTestPage: React.FC = () => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState("");

    // Breakpoint detector
    React.useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            if (width <= 576) setCurrentBreakpoint("XS (≤576px)");
            else if (width <= 768) setCurrentBreakpoint("SM (577-768px)");
            else if (width <= 992) setCurrentBreakpoint("MD (769-992px)");
            else if (width <= 1200) setCurrentBreakpoint("LG (993-1200px)");
            else if (width <= 1400) setCurrentBreakpoint("XL (1201-1400px)");
            else setCurrentBreakpoint("XXL (≥1401px)");
        };

        updateBreakpoint();
        window.addEventListener("resize", updateBreakpoint);
        return () => window.removeEventListener("resize", updateBreakpoint);
    }, []);

    const boxStyle = (color: string) => ({
        background: color,
        padding: "15px",
        textAlign: "center" as const,
        border: "1px solid #333",
        borderRadius: "4px",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold"
    });

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div
                style={{
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    background: "#333",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    zIndex: 1000
                }}>
                Current: {currentBreakpoint}
            </div>

            <h1>Grid System Test Page</h1>
            <p>Tarayıcı boyutunu değiştirerek responsive davranışı test edin.</p>

            {/* Test 1: Cascading Logic Testi */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 1: Cascading Logic (Sizin sistem mantığı)</h2>
                <p>
                    <strong>sm=4 yazıldığında md, lg, xl, xxlde de 4 görünmeli</strong>
                </p>

                <Row>
                    <Col md={4}>
                        <div style={boxStyle("#ffcccb")}>
                            md=4
                            <br />
                            (MD ve sonrasında 4 col)
                        </div>
                    </Col>
                    <Col sm={8}>
                        <div style={boxStyle("#add8e6")}>
                            sm=8
                            <br />
                            (SM ve sonrasında 8 col)
                        </div>
                    </Col>
                </Row>

                <Row style={{ marginTop: "10px" }}>
                    <Col xs={12} sm={6} lg={4}>
                        <div style={boxStyle("#98fb98")}>
                            xs=12, sm=6, lg=4
                            <br />
                            (XS:12, SM-MD:6, LG+:4)
                        </div>
                    </Col>
                    <Col xs={12} sm={6} lg={8}>
                        <div style={boxStyle("#dda0dd")}>
                            xs=12, sm=6, lg=8
                            <br />
                            (XS:12, SM-MD:6, LG+:8)
                        </div>
                    </Col>
                </Row>
            </section>

            {/* Test 2: Auto ve Full Columns */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 2: Auto ve Full Width Columns</h2>

                <Row>
                    <Col xs="auto">
                        <div style={boxStyle("#ffd700")}>
                            Auto Width
                            <br />
                            (İçeriğe göre)
                        </div>
                    </Col>
                    <Col xs="full">
                        <div style={boxStyle("#ff6347")}>
                            Full Width
                            <br />
                            (Kalan alan)
                        </div>
                    </Col>
                    <Col xs="auto">
                        <div style={boxStyle("#40e0d0")}>Auto Width</div>
                    </Col>
                </Row>
            </section>

            {/* Test 3: Kompleks Responsive Layout */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 3: Kompleks Responsive Layout</h2>

                <Row>
                    <Col xs={12} md={3}>
                        <div style={boxStyle("#f0e68c")}>
                            Sidebar
                            <br />
                            xs=12, md=3
                            <br />
                            (Mobile: Full, Desktop: 1/4)
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div style={boxStyle("#deb887")}>
                            Main Content
                            <br />
                            xs=12, md=6
                            <br />
                            (Mobile: Full, Desktop: 1/2)
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <div style={boxStyle("#f5deb3")}>
                            Right Sidebar
                            <br />
                            xs=12, md=3
                            <br />
                            (Mobile: Full, Desktop: 1/4)
                        </div>
                    </Col>
                </Row>
            </section>

            {/* Test 4: Spacing Testi */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 4: Row ve Column Spacing</h2>

                <h3>Spacing 0 (No Gap)</h3>
                <Row rowSpacing={0} colSpacing={0}>
                    <Col xs={4}>
                        <div style={boxStyle("#e0e0e0")}>Col 1</div>
                    </Col>
                    <Col xs={4}>
                        <div style={boxStyle("#d0d0d0")}>Col 2</div>
                    </Col>
                    <Col xs={4}>
                        <div style={boxStyle("#c0c0c0")}>Col 3</div>
                    </Col>
                </Row>

                <h3>Spacing 2 (Default)</h3>
                <Row rowSpacing={2} colSpacing={2}>
                    <Col xs={4}>
                        <div style={boxStyle("#ffb6c1")}>Col 1</div>
                    </Col>
                    <Col xs={4}>
                        <div style={boxStyle("#ffa07a")}>Col 2</div>
                    </Col>
                    <Col xs={4}>
                        <div style={boxStyle("#ff8c00")}>Col 3</div>
                    </Col>
                </Row>

                <h3>Spacing 5 (Large Gap)</h3>
                <Row rowSpacing={5} colSpacing={5}>
                    <Col xs={4}>
                        <div style={boxStyle("#9370db")}>Col 1</div>
                    </Col>
                    <Col xs={4}>
                        <div style={boxStyle("#8a2be2")}>Col 2</div>
                    </Col>
                    <Col xs={4}>
                        <div style={boxStyle("#7b68ee")}>Col 3</div>
                    </Col>
                </Row>
            </section>

            {/* Test 5: Flexbox Alignment */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 5: Flexbox Alignment</h2>

                <h3>Center Alignment</h3>
                <Row justifyContent="center" alignItems="center" style={{ background: "#f9f9f9", minHeight: "100px" }}>
                    <Col xs="auto">
                        <div style={boxStyle("#87ceeb")}>Centered Content</div>
                    </Col>
                </Row>

                <h3>Space Between</h3>
                <Row flexDirection="row" justifyContent="space-between">
                    <Col xs={2} md={4}>
                        <div style={boxStyle("#32cd32")}>Left</div>
                    </Col>
                    <Col xs={2}>
                        <div style={boxStyle("#ff4500")}>Center</div>
                    </Col>
                    <Col xs={2}>
                        <div style={boxStyle("#1e90ff")}>Right</div>
                    </Col>
                </Row>

                <h3>Column Direction</h3>
                <Row flexDirection="column" alignItems="center" style={{ background: "#f0f8ff" }}>
                    <Col xs="auto" style={{ margin: "5px 0" }}>
                        <div style={boxStyle("#ffd1dc")}>First (Column direction)</div>
                    </Col>
                    <Col xs="auto" style={{ margin: "5px 0" }}>
                        <div style={boxStyle("#e6e6fa")}>Second (Column direction)</div>
                    </Col>
                </Row>
            </section>

            {/* Test 6: Hidden Component */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 6: Hidden Component</h2>

                <Row>
                    <Col xs={12}>
                        <Hidden hidden="xs">
                            <div style={boxStyle("#ffe4e1")}>Bu div XS ekranlarda gizli (hidden="xs")</div>
                        </Hidden>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12}>
                        <Hidden hidden="sm">
                            <div style={boxStyle("#ae2617")}>Bu div SM ekranlarda gizli (hidden="sm")</div>
                        </Hidden>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Hidden hidden="md">
                            <div style={boxStyle("#f0ffff")}>Bu div MD ekranlarda ve altında gizli (hidden="md")</div>
                        </Hidden>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12}>
                        <Hidden onlyHidden={["sm", "lg"]}>
                            <div style={boxStyle("#f5fffa")}>Bu div sadece SM ve LG ekranlarda gizli (onlyHidden=['sm', 'lg'])</div>
                        </Hidden>
                    </Col>
                </Row>
            </section>

            {/* Test 7: Tüm Grid Boyutları */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 7: Grid Boyutları (1-12)</h2>

                <Row colSpacing={2} rowSpacing={2}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size: any) => (
                        <Col key={size} sm={size} style={{ marginBottom: "5px" }}>
                            <div style={boxStyle(`hsl(${size * 30}, 70%, 70%)`)}>Col {size}/12</div>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Test 8: Gerçek Dünya Örnekleri */}
            <section style={{ marginBottom: "40px" }}>
                <h2>🧪 Test 8: Gerçek Dünya Layout Örnekleri</h2>

                <h3>Blog Layout</h3>
                <Row>
                    <Col xs={12} lg={8}>
                        <div style={boxStyle("#fff8dc")}>
                            <h4>Ana İçerik Alanı</h4>
                            <p>Blog yazıları, makale içeriği...</p>
                        </div>
                    </Col>
                    <Col xs={12} lg={4}>
                        <div style={boxStyle("#f0f8ff")}>
                            <h4>Sidebar</h4>
                            <p>Kategoriler, popüler yazılar...</p>
                        </div>
                    </Col>
                </Row>

                <h3>E-commerce Product Grid</h3>
                <Row justifyContent="center" rowSpacing={3} colSpacing={3}>
                    <Col xs={6} sm={4} md={3} lg={2}>
                        <div style={boxStyle("#ffe4e1")}>Product 1</div>
                    </Col>
                    <Col xs={6} sm={4} md={3} lg={2}>
                        <div style={boxStyle("#e1ffe4")}>Product 2</div>
                    </Col>
                    <Col xs={6} sm={4} md={3} lg={2}>
                        <div style={boxStyle("#e4e1ff")}>Product 3</div>
                    </Col>
                    <Col xs={6} sm={4} md={3} lg={2}>
                        <div style={boxStyle("#ffe1e4")}>Product 4</div>
                    </Col>
                    <Col xs={6} sm={4} md={3} lg={2}>
                        <div style={boxStyle("#e1e4ff")}>Product 5</div>
                    </Col>
                    <Col xs={6} sm={4} md={3} lg={2}>
                        <div style={boxStyle("#e4ffe1")}>Product 6</div>
                    </Col>
                </Row>
            </section>

            <div
                style={{
                    background: "#f0f0f0",
                    padding: "20px",
                    borderRadius: "8px",
                    marginTop: "40px"
                }}>
                <h3>🔍 Nasıl Test Edilir:</h3>
                <ol>
                    <li>
                        <strong>Tarayıcı boyutunu değiştirin</strong> - Responsive davranışı gözlemleyin
                    </li>
                    <li>
                        <strong>Developer Tools açın</strong> - Responsive mode'da test edin
                    </li>
                    <li>
                        <strong>Sağ üst köşedeki breakpoint bilgisini</strong> takip edin
                    </li>
                    <li>
                        <strong>Her test bölümünde</strong> farklı breakpoint'lerde nasıl davrandığına bakın
                    </li>
                </ol>

                <p>
                    <strong>Önemli:</strong> Sizin sisteminizdeki cascading mantık şöyle çalışıyor:
                </p>
                <ul>
                    <li>
                        <code>sm=4</code> yazdığınızda → SM, MD, LG, XL, XXL'de 4 column
                    </li>
                    <li>
                        <code>sm=4 lg=6</code> yazdığınızda → SM ve MD'de 4, LG, XL, XXL'de 6 column
                    </li>
                    <li>Bu mantık CSS'de !important ile sağlanıyor</li>
                </ul>
            </div>
        </div>
    );
};

export default GridTestPage;
