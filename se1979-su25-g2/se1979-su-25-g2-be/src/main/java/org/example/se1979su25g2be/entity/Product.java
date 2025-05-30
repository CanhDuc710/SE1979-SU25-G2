package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(unique = true, length = 50, nullable = false)
    private String productCode;

    @Column(length = 200, nullable = false)
    private String name;

    @Lob
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(length = 100)
    private String brand;

    @Column(length = 100)
    private String material;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @CreationTimestamp
    private Timestamp createdAt;

    private Boolean isActive;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;



    public enum Gender {
        MALE, FEMALE, UNISEX
    }

    // ✅ Builder thủ công
    public static class ProductBuilder {
        private final Product product;

        public ProductBuilder() {
            this.product = new Product();
        }

        public ProductBuilder productCode(String productCode) {
            product.setProductCode(productCode);
            return this;
        }

        public ProductBuilder name(String name) {
            product.setName(name);
            return this;
        }

        public ProductBuilder description(String description) {
            product.setDescription(description);
            return this;
        }

        public ProductBuilder category(Category category) {
            product.setCategory(category);
            return this;
        }

        public ProductBuilder brand(String brand) {
            product.setBrand(brand);
            return this;
        }

        public ProductBuilder material(String material) {
            product.setMaterial(material);
            return this;
        }

        public ProductBuilder gender(Gender gender) {
            product.setGender(gender);
            return this;
        }

        public ProductBuilder isActive(Boolean isActive) {
            product.setIsActive(isActive);
            return this;
        }
        public ProductBuilder price(BigDecimal price) {
            product.setPrice(price);
            return this;
        }
        public ProductBuilder images(List<ProductImage> images) {
            product.setImages(images);
            return this;
        }

        public Product build() {
            return product;
        }

    }

    public static ProductBuilder builder() {
        return new ProductBuilder();
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }
}

