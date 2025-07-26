package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.se1979su25g2be.entity.Collection;
import org.example.se1979su25g2be.entity.Product;

import java.util.List;

@Getter
@Setter
public class CollectionDTO {
    private Integer id;
    private String name;
    private String description;
    private String bannerUrl;
    private List<Integer> productIds;

    public static CollectionDTO fromEntity(Collection collection) {
        List<Integer> ids = collection.getProducts() != null 
            ? collection.getProducts().stream().map(Product::getProductId).toList() 
            : List.of();
        return new CollectionDTO(
                collection.getId(),
                collection.getName(),
                collection.getDescription(),
                collection.getBannerUrl(),
                ids
        );
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public List<Integer> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Integer> productIds) {
        this.productIds = productIds;
    }

    public CollectionDTO(Integer id, String name, String description, String bannerUrl, List<Integer> productIds) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.bannerUrl = bannerUrl;
        this.productIds = productIds;
    }

    public CollectionDTO() {
    }
}


