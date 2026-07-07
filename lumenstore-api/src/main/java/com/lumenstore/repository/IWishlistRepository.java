package com.lumenstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lumenstore.models.Wishlist;
import java.util.List;
import java.util.Optional;

@Repository
public interface IWishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByCustomerId(Long customerId);
    Optional<Wishlist> findByCustomerIdAndIsDefaultTrue(Long customerId);
    Optional<Wishlist> findByCustomerIdAndId(Long customerId, Long wishlistId);
}
