export default function Footer(){
    return (
       <footer className="bg-dark text-white py-4">
            <div className="container">
                <div className="d-flex justify-content-center mt-5">
                    <div className="me-4"><a className="text-secondary text-decoration-none fs-4 fw-semibold"href="/">Roadmaps</a></div>
                    <div className="me-4"><a className="text-secondary text-decoration-none fs-4 fw-semibold"href="/guides">Guides</a></div>
                    <div className="me-4"><a className="text-secondary text-decoration-none fs-4 fw-semibold"href="/faqs">FAQs</a></div>
                    <div><a className="text-secondary text-decoration-none fs-4 fw-semibold" href="/youtube">YouTube</a></div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <p className="fs-4 text-secondary mb-1">
                            Community created roadmaps, best practices, projects, articles, resources and journeys to help you choose your path and grow in your career.
                        </p>
                        <ul className="d-flex gap-4 list-unstyled">
                            <li ><a href="/about" className="text-secondary text-decoration-none fs-5">© roadmap.sh</a></li>
                            <li><a href="/contact-us" className="text-secondary text-decoration-none fs-5">Contact Us</a></li>
                            <li><a href="/privacy-policy" className="text-secondary text-decoration-none fs-5">Privacy</a></li>
                            <li><a href="/terms-of-service" className="text-secondary text-decoration-none fs-5">Terms</a></li>
                        </ul>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="mb-0">© {new Date().getFullYear()} RoadmapHub. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}