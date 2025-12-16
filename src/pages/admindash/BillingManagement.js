import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/BillingManagement.css';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNav from '../../components/AdminNav';
import { FaEllipsisV } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';

const BillingManagement = () => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [sortBy, setSortBy] = useState('');  // new state for filter selection

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/subscription/subscribe', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || [];
        const mapped = data.map((sub, index) => ({
          invoiceNumber: `INV-${1001 + index}`,
          userId: sub.user?._id || 'N/A',
          paymentDate: new Date(sub.startDate).toLocaleDateString(),
          amount: `${sub.price} EGP`,
          paymentMethod: sub.method,
          status: 'Paid',
          issued: new Date(sub.startDate).toLocaleDateString(),
          due: new Date(new Date(sub.startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          billedTo: {
            name: sub.user?._id || 'N/A',
            company: 'MiloFit Gym',
            address: '6th October, Giza, Egypt',
            email: sub.user?.email,
            phone: sub.user?.phone || 'N/A',
          },
          from: {
            company: 'MiloFit Gym',
            branch: '6th October Branch',
            contactName: 'Admin',
            email: 'milofit@admin.com',
          },
          service: sub.packageName || 'Fitness Package',
          rate: `${sub.price} EGP`,
          subtotal: `${sub.price} EGP`,
          tax: '0',
          total: `${sub.price} EGP`,
        }));

        setInvoices(mapped);
      } catch (err) {
        console.error('Failed to fetch subscriptions:', err);
      }
    };

    fetchInvoices();
  }, []);

  // Filter invoices by search term (invoice number)
  const filteredInvoices = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort invoices if a sort option selected
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === 'Amount') {
      // Parse amount number before comparison
      const amountA = parseFloat(a.amount);
      const amountB = parseFloat(b.amount);
      return amountA - amountB;
    }
    if (sortBy === 'Date') {
      // Sort by paymentDate
      return new Date(a.paymentDate) - new Date(b.paymentDate);
    }
    return 0; // no sorting
  });

  const handleViewToggle = (invoiceNumber) => {
    if (selectedInvoice && selectedInvoice.invoiceNumber === invoiceNumber) {
      setSelectedInvoice(null);
    } else {
      const invoice = invoices.find((inv) => inv.invoiceNumber === invoiceNumber);
      setSelectedInvoice(invoice);
    }
  };

  return (
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="billingmanage-container">
          <div className="billing-header">
            <input
              type="text"
              placeholder="Search Invoice Number"
              className="billing-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="billing-filter">
              <div
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{ cursor: 'pointer' }}
                aria-label="Toggle filter dropdown"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowFilterDropdown(!showFilterDropdown);
                  }
                }}
              >
                <IoFilter size={26} />
              </div>

              {showFilterDropdown && (
                <div className="billingfilter-dropdown">
                  <label htmlFor="sortby">SORT BY:</label>
                  <select
                    id="sortby"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="Amount">Amount</option>
                    <option value="Date">Date</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <table className="billing-table">
            <thead>
              <tr>
                <th>INVOICE NUMBER</th>
                <th>PAYMENT DATE</th>
                <th>AMOUNT</th>
                <th>METHOD</th>
                <th>STATUS</th>
                <th>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.length > 0 ? (
                sortedInvoices.map((invoice) => (
                  <tr key={invoice.invoiceNumber}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.paymentDate}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.paymentMethod}</td>
                    <td className={invoice.status === 'Paid' ? 'status-paid' : ''}>
                      {invoice.status}
                    </td>
                    <td>
                      <button
                        className="billingview"
                        onClick={() => handleViewToggle(invoice.invoiceNumber)}
                        style={{ cursor: 'pointer' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ color: 'white', textAlign: 'center' }}>
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedInvoice && (
            <div className="invoice-preview">
              <h3>INVOICE</h3>
              <p>#{selectedInvoice.invoiceNumber}</p>
              <div className="invoice-details">
                <div>
                  <strong>Issued</strong><br />
                  {selectedInvoice.issued}
                </div>
                <div>
                  <strong>Due</strong><br />
                  {selectedInvoice.due}
                </div>
                <div>
                  <strong>Billed to</strong><br />
                  {selectedInvoice.billedTo.name}<br />
                  {selectedInvoice.billedTo.company}<br />
                  {selectedInvoice.billedTo.address}<br />
                  {selectedInvoice.billedTo.email}<br />
                  {selectedInvoice.billedTo.phone}
                </div>
                <div>
                  <strong>From</strong><br />
                  {selectedInvoice.from.company}<br />
                  {selectedInvoice.from.branch}<br />
                  {selectedInvoice.from.contactName}<br />
                  {selectedInvoice.from.email}
                </div>
              </div>
              <div className="invoice-services">
                <p><strong>Service:</strong> {selectedInvoice.service}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Rate</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedInvoice.rate}</td>
                      <td>{selectedInvoice.rate}</td>
                    </tr>
                  </tbody>
                </table>
                <p>Subtotal: {selectedInvoice.subtotal}</p>
                <p>Tax (0%): {selectedInvoice.tax}</p>
                <p><strong>Total: {selectedInvoice.total}</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
