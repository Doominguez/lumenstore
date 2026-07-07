package com.lumenstore.controller;

import com.lumenstore.dto.WishlistRequestDTO;
import com.lumenstore.dto.WishlistResponseDTO;
import com.lumenstore.models.Wishlist;
import com.lumenstore.models.WishlistItem;
import com.lumenstore.dto.WishlistItemResponseDTO;
import com.lumenstore.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers/{customerId}/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<WishlistResponseDTO> createWishlist(
            @PathVariable Long customerId,
            @RequestBody WishlistRequestDTO request) {
        Wishlist wishlist = wishlistService.createWishlist(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wishlistService.getDefaultWishlist(customerId));
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponseDTO>> getWishlistsByCustomer(
            @PathVariable Long customerId) {
        List<WishlistResponseDTO> wishlists = wishlistService.getWishlistsByCustomer(customerId);
        return ResponseEntity.ok(wishlists);
    }

    @GetMapping("/default")
    public ResponseEntity<WishlistResponseDTO> getDefaultWishlist(
            @PathVariable Long customerId) {
        WishlistResponseDTO wishlist = wishlistService.getDefaultWishlist(customerId);
        return ResponseEntity.ok(wishlist);
    }

    @GetMapping("/{wishlistId}")
    public ResponseEntity<WishlistResponseDTO> getWishlist(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId) {
        WishlistResponseDTO wishlist = wishlistService.getWishlistById(customerId, wishlistId);
        return ResponseEntity.ok(wishlist);
    }

    @PutMapping("/{wishlistId}")
    public ResponseEntity<WishlistResponseDTO> updateWishlist(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId,
            @RequestBody WishlistRequestDTO request) {
        WishlistResponseDTO wishlist = wishlistService.updateWishlist(customerId, wishlistId, request);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> deleteWishlist(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId) {
        wishlistService.deleteWishlist(customerId, wishlistId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{wishlistId}/products/{productId}")
    public ResponseEntity<WishlistItemResponseDTO> addProductToWishlist(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId,
            @PathVariable Long productId) {
        wishlistService.addProductToWishlist(customerId, wishlistId, productId);
        List<WishlistItemResponseDTO> items = wishlistService.getWishlistItems(customerId, wishlistId);
        WishlistItemResponseDTO lastItem = items.isEmpty() ? null : items.get(items.size() - 1);
        return ResponseEntity.status(HttpStatus.CREATED).body(lastItem);
    }

    @DeleteMapping("/{wishlistId}/products/{productId}")
    public ResponseEntity<Void> removeProductFromWishlist(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId,
            @PathVariable Long productId) {
        wishlistService.removeProductFromWishlist(customerId, wishlistId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{wishlistId}/items")
    public ResponseEntity<List<WishlistItemResponseDTO>> getWishlistItems(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId) {
        List<WishlistItemResponseDTO> items = wishlistService.getWishlistItems(customerId, wishlistId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{wishlistId}/products/{productId}/exists")
    public ResponseEntity<Boolean> isProductInWishlist(
            @PathVariable Long customerId,
            @PathVariable Long wishlistId,
            @PathVariable Long productId) {
        boolean exists = wishlistService.isProductInWishlist(customerId, wishlistId, productId);
        return ResponseEntity.ok(exists);
    }
}