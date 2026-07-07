package com.lumenstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponseDTO {
    private Long id;
    private Long wishlistId;
    private Long productId;
    private ProductBriefDTO product;
    private LocalDateTime addedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductBriefDTO {
        private Long id;
        private String name;
        private String slug;
        private Double basePrice;
        private String[] images;
    }
}