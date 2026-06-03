import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <Container>
      <h1>Our Services</h1>
      <p style={{ marginBottom: "24px" }}>
        Nexografix provides a range of technology-enabled services:
      </p>

      <div style={{ display: "grid", gap: "16px", maxWidth: 600 }}>
        {services.map((service) => (
          <Card key={service.id}>
            <h2 style={{ marginBottom: "8px" }}>{service.title}</h2>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {service.shortDescription}
            </p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
