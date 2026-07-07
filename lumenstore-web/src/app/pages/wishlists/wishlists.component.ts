import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { Wishlist, WishlistItem } from '../../models';

@Component({
  selector: 'app-wishlists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlists.component.html',
  styleUrls: ['./wishlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistsComponent implements OnInit {
  wishlists: Wishlist[] = [];
  selectedWishlist: Wishlist | null = null;
  items: WishlistItem[] = [];
  loading = false;
  error = '';

  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadWishlists();
  }

  loadWishlists() {
    const clientId = this.getClientId();
    if (!clientId) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/wishlists' } });
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.wishlistService.getWishlistsByCustomer(clientId).subscribe({
      next: (wishlists: any) => {
        this.wishlists = Array.isArray(wishlists) ? wishlists : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar tus listas de favoritos';
        this.cdr.markForCheck();
      },
    });
  }

  selectWishlist(wishlist: Wishlist) {
    this.selectedWishlist = wishlist;
    this.loadItems(wishlist.id);
  }

  loadItems(wishlistId: number) {
    const clientId = this.getClientId();
    if (!clientId) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.wishlistService.getWishlistItems(clientId, wishlistId).subscribe({
      next: (items: any) => {
        this.items = Array.isArray(items) ? items : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los productos';
        this.cdr.markForCheck();
      },
    });
  }

  removeItem(productId: number) {
    const clientId = this.getClientId();
    if (!clientId || !this.selectedWishlist) return;

    this.wishlistService
      .removeProductFromWishlist(clientId, this.selectedWishlist.id, productId)
      .subscribe({
        next: () => {
          this.items = this.items.filter((i) => i.productId !== productId);
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'No se pudo eliminar el producto';
          this.cdr.markForCheck();
        },
      });
  }

  deleteWishlist(wishlistId: number) {
    const clientId = this.getClientId();
    if (!clientId) return;

    if (!confirm('¿Eliminar esta lista de favoritos?')) return;

    this.wishlistService.deleteWishlist(clientId, wishlistId).subscribe({
      next: () => {
        this.wishlists = this.wishlists.filter((w) => w.id !== wishlistId);
        if (this.selectedWishlist?.id === wishlistId) {
          this.selectedWishlist = null;
          this.items = [];
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo eliminar la lista';
        this.cdr.markForCheck();
      },
    });
  }

  getItemPrice(item: WishlistItem): number {
    return item.product?.basePrice ?? 0;
  }

  goBack() {
    this.selectedWishlist = null;
    this.items = [];
    this.cdr.markForCheck();
  }

  private getClientId(): number | null {
    return this.authService.getCurrentUser()?.id ?? null;
  }
}
